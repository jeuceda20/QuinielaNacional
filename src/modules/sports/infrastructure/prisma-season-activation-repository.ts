import type {
  SeasonActivationRepository,
  SeasonActivationResult,
} from "@/modules/sports/application/activate-season";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaSeasonActivationRepository implements SeasonActivationRepository {
  public constructor(
    private readonly db: Pick<
      PrismaClient,
      "$transaction" | "season" | "team" | "auditLog"
    > = prisma,
  ) {}
  async activate(
    seasonId: string,
    actorId: string,
    now: Date,
    requestId?: string | null,
  ): Promise<SeasonActivationResult> {
    return this.db.$transaction(
      async (t) => {
        const season = await t.season.findFirst({
          where: { id: seasonId, archivedAt: null },
          select: { id: true, status: true },
        });
        if (!season) return "NOT_FOUND";
        if (season.status === "ACTIVE") return "ALREADY_ACTIVE";
        if (season.status !== "DRAFT") return "INVALID_STATE";
        if ((await t.team.count({ where: { isActive: true, deletedAt: null } })) < 2)
          return "INSUFFICIENT_ACTIVE_TEAMS";
        if (
          await t.season.findFirst({
            where: { status: "ACTIVE", archivedAt: null },
            select: { id: true },
          })
        )
          return "ACTIVE_SEASON_ALREADY_EXISTS";
        const updated = await t.season.updateMany({
          where: { id: season.id, status: "DRAFT", archivedAt: null },
          data: { status: "ACTIVE" },
        });
        if (updated.count !== 1) return "INVALID_STATE";
        await t.auditLog.create({
          data: {
            actorUserId: actorId,
            actorRole: "ADMIN",
            action: "SEASON_ACTIVATED",
            entityType: "SEASON",
            entityId: season.id,
            beforeJson: { status: "DRAFT" },
            afterJson: { status: "ACTIVE" },
            requestId: requestId ?? null,
          },
        });
        return "ACTIVATED";
      },
      { isolationLevel: "Serializable" },
    );
  }
}
