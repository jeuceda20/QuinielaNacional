import type { RoundRepository } from "@/modules/sports/application/manage-round";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

export class PrismaRoundManagementRepository implements RoundRepository {
  public constructor(
    private readonly db: Pick<
      PrismaClient,
      "$transaction" | "season" | "round" | "auditLog"
    > = prisma,
  ) {}
  public async create(input: Parameters<RoundRepository["create"]>[0]) {
    try {
      return await this.db.$transaction(async (t) => {
        if (!(await t.season.findFirst({ where: { id: input.seasonId, archivedAt: null } })))
          return "INVALID_SEASON" as const;
        const round = await t.round.create({
          data: {
            seasonId: input.seasonId,
            name: input.name,
            slug: input.slug,
            sequence: input.sequence ?? null,
            description: input.description ?? null,
            status: "DRAFT",
          },
        });
        await t.auditLog.create({
          data: {
            actorUserId: input.actorId,
            actorRole: "ADMIN",
            action: "ROUND_CREATED",
            entityType: "ROUND",
            entityId: round.id,
            afterJson: { status: "DRAFT", sequence: round.sequence },
          },
        });
        return "CREATED" as const;
      });
    } catch {
      return "DUPLICATE" as const;
    }
  }
  public async update() {
    return false;
  }
  public async setStatus(id: string, status: "PUBLISHED" | "ARCHIVED", actorId: string) {
    const round = await this.db.round.updateMany({
      where: {
        id,
        archivedAt: null,
        status: status === "PUBLISHED" ? "DRAFT" : { in: ["DRAFT", "PUBLISHED"] },
      },
      data: {
        status,
        ...(status === "PUBLISHED" ? { publishedAt: new Date() } : { archivedAt: new Date() }),
      },
    });
    if (round.count)
      await this.db.auditLog.create({
        data: {
          actorUserId: actorId,
          actorRole: "ADMIN",
          action: status === "ARCHIVED" ? "ROUND_ARCHIVED" : "ROUND_UPDATED",
          entityType: "ROUND",
          entityId: id,
          afterJson: { status },
        },
      });
    return round.count === 1;
  }
}
