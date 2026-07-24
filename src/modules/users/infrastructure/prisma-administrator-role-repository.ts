import type {
  AdministratorRolePersistenceResult,
  AdministratorRoleRepository,
  ManageAdministratorRoleInput,
} from "@/modules/users/application/manage-administrator-role";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

type AdministratorRoleDatabase = Pick<
  PrismaClient,
  "$transaction" | "auditLog" | "roleHistory" | "user"
>;

export class PrismaAdministratorRoleRepository implements AdministratorRoleRepository {
  public constructor(private readonly database: AdministratorRoleDatabase = prisma) {}

  public async changeRole(
    input: ManageAdministratorRoleInput & { now: Date },
  ): Promise<AdministratorRolePersistenceResult> {
    return this.database.$transaction(async (transaction) => {
      const user = await transaction.user.findFirst({
        where: { id: input.userId, deletedAt: null },
        select: { id: true, role: true, status: true },
      });
      if (!user) return { status: "NOT_FOUND" };
      if (user.role === input.newRole) return { status: "ALREADY_ASSIGNED" };
      if (
        user.status !== "APPROVED" ||
        !(
          (user.role === "USER" && input.newRole === "ADMIN") ||
          (user.role === "ADMIN" && input.newRole === "USER")
        )
      ) {
        return { status: "INVALID_STATE" };
      }

      const updated = await transaction.user.updateMany({
        where: { id: user.id, role: user.role, status: "APPROVED" },
        data: { role: input.newRole },
      });
      if (updated.count !== 1) return { status: "INVALID_STATE" };

      await transaction.roleHistory.create({
        data: {
          userId: user.id,
          previousRole: user.role,
          newRole: input.newRole,
          changedById: input.actor.id,
          reason: input.reason ?? null,
          createdAt: input.now,
        },
      });
      await transaction.auditLog.create({
        data: {
          actorUserId: input.actor.id,
          actorRole: input.actor.role,
          action: "USER_ROLE_CHANGED",
          entityType: "USER",
          entityId: user.id,
          beforeJson: { role: user.role },
          afterJson: { role: input.newRole },
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
