import type { SavePredictionRepository } from "@/modules/predictions/application/save-prediction";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaSavePredictionRepository implements SavePredictionRepository {
  public constructor(
    private readonly db: Pick<PrismaClient, "match" | "seasonParticipant" | "prediction"> = prisma,
  ) {}
  async save(i: {
    userId: string;
    matchId: string;
    homeGoals: number;
    awayGoals: number;
    now: Date;
  }) {
    const match = await this.db.match.findFirst({
      where: {
        id: i.matchId,
        archivedAt: null,
        status: { in: ["SCHEDULED", "RESCHEDULED", "RESUMED"] },
      },
      select: { id: true, seasonId: true, predictionClosesAt: true },
    });
    if (!match) return "MATCH_NOT_FOUND" as const;
    if (match.predictionClosesAt <= i.now) return "MATCH_CLOSED" as const;
    if (
      !(await this.db.seasonParticipant.findFirst({
        where: { seasonId: match.seasonId, userId: i.userId, isEligible: true, excludedAt: null },
      }))
    )
      return "NOT_PARTICIPANT" as const;
    await this.db.prediction.upsert({
      where: { userId_matchId: { userId: i.userId, matchId: match.id } },
      create: {
        userId: i.userId,
        matchId: match.id,
        homeGoals: i.homeGoals,
        awayGoals: i.awayGoals,
        submittedAt: i.now,
      },
      update: {
        homeGoals: i.homeGoals,
        awayGoals: i.awayGoals,
        submittedAt: i.now,
        deletedAt: null,
      },
    });
    return "SAVED" as const;
  }
}
