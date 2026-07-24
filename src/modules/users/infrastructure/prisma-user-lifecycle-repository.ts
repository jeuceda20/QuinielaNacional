import { UserLifecycleAction } from "@/modules/auth/domain/authorization-policies";
import type {
  LifecyclePersistenceResult,
  ManageUserLifecycleInput,
  UserLifecycleRepository,
} from "@/modules/users/application/manage-user-lifecycle";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

type UserLifecycleDatabase = Pick<PrismaClient, "$transaction" | "auditLog" | "session" | "user">;

const transition = {
  [UserLifecycleAction.REJECT]: {
    from: "PENDING_APPROVAL",
    to: "REJECTED",
    audit: "USER_REJECTED",
  },
  [UserLifecycleAction.BLOCK]: { from: "APPROVED", to: "BLOCKED", audit: "USER_BLOCKED" },
  [UserLifecycleAction.UNBLOCK]: { from: "BLOCKED", to: "APPROVED", audit: "USER_UNBLOCKED" },
  [UserLifecycleAction.DISABLE]: { from: "APPROVED", to: "DISABLED", audit: "USER_DISABLED" },
  [UserLifecycleAction.ENABLE]: { from: "DISABLED", to: "APPROVED", audit: "USER_ENABLED" },
} as const;

export class PrismaUserLifecycleRepository implements UserLifecycleRepository {
  public constructor(private readonly database: UserLifecycleDatabase = prisma) {}

  public async apply(
    input: ManageUserLifecycleInput & { now: Date },
  ): Promise<LifecyclePersistenceResult> {
    return this.database.$transaction(async (transaction) => {
      const current = transition[input.action];
      const user = await transaction.user.findFirst({
        where: { id: input.userId, deletedAt: null },
        select: { id: true, status: true },
      });
      if (!user) return { status: "NOT_FOUND" };
      if (user.status !== current.from) return { status: "INVALID_STATE" };

      const data = {
        status: current.to,
        ...(input.action === UserLifecycleAction.REJECT
          ? {
              rejectedAt: input.now,
              rejectedById: input.actor.id,
              rejectionReason: input.reason ?? null,
            }
          : {}),
        ...(input.action === UserLifecycleAction.BLOCK
          ? { blockedAt: input.now, blockedById: input.actor.id, blockReason: input.reason ?? null }
          : {}),
      };
      const updated = await transaction.user.updateMany({
        where: { id: user.id, status: current.from },
        data,
      });
      if (updated.count !== 1) return { status: "INVALID_STATE" };

      if (
        input.action === UserLifecycleAction.BLOCK ||
        input.action === UserLifecycleAction.DISABLE
      ) {
        await transaction.session.updateMany({
          where: { userId: user.id, revokedAt: null },
          data: { revokedAt: input.now },
        });
      }
      await transaction.auditLog.create({
        data: {
          actorUserId: input.actor.id,
          actorRole: input.actor.role,
          action: current.audit,
          entityType: "USER",
          entityId: user.id,
          beforeJson: { status: current.from },
          afterJson: { status: current.to },
          metadataJson: { reason: input.reason ?? null },
          ipAddress: input.ipAddress ?? null,
          userAgent: input.userAgent ?? null,
          requestId: input.requestId ?? null,
        },
      });
      return { status: "CHANGED" };
    });
  }
}
