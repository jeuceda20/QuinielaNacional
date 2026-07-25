import type { TeamManagementRepository } from "@/modules/sports/application/manage-team";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaTeamManagementRepository implements TeamManagementRepository {
  public constructor(
    private readonly db: Pick<PrismaClient, "team" | "auditLog" | "$transaction"> = prisma,
  ) {}
  async create(input: Parameters<TeamManagementRepository["create"]>[0]) {
    try {
      await this.db.$transaction(async (t) => {
        const team = await t.team.create({
          data: {
            name: input.name,
            shortName: input.shortName,
            slug: input.slug,
            logoPath: input.logoPath ?? null,
            displayOrder: input.displayOrder,
          },
        });
        await t.auditLog.create({
          data: {
            actorUserId: input.actorId,
            actorRole: "ADMIN",
            action: "SETTINGS_UPDATED",
            entityType: "TEAM",
            entityId: team.id,
            afterJson: { isActive: true },
          },
        });
      });
      return "CREATED" as const;
    } catch {
      return "DUPLICATE" as const;
    }
  }
  async update(id: string, input: Parameters<TeamManagementRepository["update"]>[1]) {
    const r = await this.db.team.updateMany({
      where: { id, deletedAt: null },
      data: {
        name: input.name,
        shortName: input.shortName,
        logoPath: input.logoPath ?? null,
        displayOrder: input.displayOrder,
      },
    });
    return r.count === 1;
  }
  async setActive(id: string, isActive: boolean) {
    const r = await this.db.team.updateMany({ where: { id, deletedAt: null }, data: { isActive } });
    return r.count === 1;
  }
  async softDelete(id: string) {
    const r = await this.db.team.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date(), isActive: false },
    });
    return r.count === 1;
  }
}
