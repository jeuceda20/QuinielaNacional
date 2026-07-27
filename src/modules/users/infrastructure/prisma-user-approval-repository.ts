import type {
  ApprovalPersistenceResult,
  ApproveUserInput,
  UserApprovalRepository,
} from "@/modules/users/application/approve-user";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

type UserApprovalDatabase = Pick<
  PrismaClient,
  "$transaction" | "auditLog" | "season" | "seasonParticipant" | "user"
>;

export class PrismaUserApprovalRepository implements UserApprovalRepository {
  public constructor(private readonly database: UserApprovalDatabase = prisma) {}

  public async approve(
    input: ApproveUserInput & { now: Date },
  ): Promise<ApprovalPersistenceResult> {
    return this.database.$transaction(async (transaction) => {
      const user = await transaction.user.findFirst({
        where: { id: input.userId, deletedAt: null },
        select: { id: true, email: true, firstName: true, status: true, emailVerifiedAt: true },
      });
      if (!user) return { status: "NOT_FOUND" };
      if (user.status === "APPROVED") return { status: "ALREADY_APPROVED" };
      if (user.status !== "PENDING_APPROVAL")
        return { status: "INVALID_STATE" };

      let seasonId: string | null = null;
      if (input.addToActiveSeason) {
        const season = await transaction.season.findFirst({
          where: { status: "ACTIVE", archivedAt: null },
          select: { id: true },
        });
        seasonId = season?.id ?? null;
      }

      const updated = await transaction.user.updateMany({
        where: { id: user.id, status: "PENDING_APPROVAL" },
        data: { status: "APPROVED", approvedAt: input.now, approvedById: input.actor.id },
      });
      if (updated.count !== 1) return { status: "INVALID_STATE" };

      if (seasonId) {
        await transaction.seasonParticipant.upsert({
          where: { seasonId_userId: { seasonId, userId: user.id } },
          create: { seasonId, userId: user.id, joinedAt: input.now, isEligible: true },
          update: {},
        });
      }

      await transaction.auditLog.create({
        data: {
          actorUserId: input.actor.id,
          actorRole: input.actor.role,
          action: "USER_APPROVED",
          entityType: "USER",
          entityId: user.id,
          beforeJson: { status: user.status },
          afterJson: { status: "APPROVED" },
          metadataJson: { seasonId },
          ipAddress: input.ipAddress ?? null,
          userAgent: input.userAgent ?? null,
          requestId: input.requestId ?? null,
        },
      });

      return {
        status: "APPROVED",
        user: { id: user.id, email: user.email, firstName: user.firstName },
        seasonId,
      };
    });
  }
}
