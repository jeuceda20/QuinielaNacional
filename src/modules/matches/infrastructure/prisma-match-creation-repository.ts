import type { MatchCreationRepository } from "@/modules/matches/application/create-match";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaMatchCreationRepository implements MatchCreationRepository {
  public constructor(
    private readonly db: Pick<
      PrismaClient,
      "$transaction" | "round" | "team" | "match" | "auditLog"
    > = prisma,
  ) {}
  async create(i: Parameters<MatchCreationRepository["create"]>[0]) {
    return this.db.$transaction(async (t) => {
      const round = await t.round.findFirst({
        where: { id: i.roundId, archivedAt: null },
        select: { id: true, seasonId: true },
      });
      if (!round) return "INVALID_ROUND" as const;
      const teams = await t.team.count({
        where: { id: { in: [i.homeTeamId, i.awayTeamId] }, isActive: true, deletedAt: null },
      });
      if (teams !== 2) return "INVALID_TEAM" as const;
      if (
        await t.match.findFirst({
          where: {
            roundId: i.roundId,
            homeTeamId: i.homeTeamId,
            awayTeamId: i.awayTeamId,
            scheduledAt: i.scheduledAt,
            archivedAt: null,
          },
        })
      )
        return "DUPLICATE" as const;
      const m = await t.match.create({
        data: {
          seasonId: round.seasonId,
          roundId: i.roundId,
          homeTeamId: i.homeTeamId,
          awayTeamId: i.awayTeamId,
          scheduledAt: i.scheduledAt,
          predictionClosesAt: i.predictionClosesAt,
          status: "SCHEDULED",
          isDoublePoints: false,
          venue: i.venue ?? null,
          notes: i.notes ?? null,
        },
      });
      await t.auditLog.create({
        data: {
          actorUserId: i.actorId,
          actorRole: "ADMIN",
          action: "MATCH_CREATED",
          entityType: "MATCH",
          entityId: m.id,
          afterJson: {
            roundId: i.roundId,
            homeTeamId: i.homeTeamId,
            awayTeamId: i.awayTeamId,
            scheduledAt: i.scheduledAt.toISOString(),
            predictionClosesAt: i.predictionClosesAt.toISOString(),
            isDoublePoints: false,
          },
        },
      });
      return "CREATED" as const;
    });
  }
}
