import type {
  PublicMatchResult,
  PublicResultsRepository,
} from "@/modules/results/application/get-public-results";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

export class PrismaPublicResultsRepository implements PublicResultsRepository {
  public constructor(private readonly database: Pick<PrismaClient, "match"> = prisma) {}

  public async list(): Promise<readonly PublicMatchResult[]> {
    const matches = await this.database.match.findMany({
      where: { status: "PROCESSED", archivedAt: null },
      orderBy: { processedAt: "desc" },
      select: {
        id: true,
        officialHomeGoals: true,
        officialAwayGoals: true,
        resultVersion: true,
        round: { select: { name: true } },
        homeTeam: { select: { name: true } },
        awayTeam: { select: { name: true } },
        predictionScores: {
          select: {
            scoreType: true,
            awardedPoints: true,
            resultVersion: true,
            prediction: { select: { homeGoals: true, awayGoals: true } },
            user: { select: { nickname: true } },
          },
        },
      },
    });
    return matches.map((match) => ({
      id: match.id,
      roundName: match.round.name,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      officialResult: `${match.officialHomeGoals}-${match.officialAwayGoals}`,
      rows: match.predictionScores
        .filter((score) => score.resultVersion === match.resultVersion)
        .sort((left, right) => left.user.nickname.localeCompare(right.user.nickname))
        .map((score) => ({
          nickname: score.user.nickname,
          prediction: score.prediction
            ? `${score.prediction.homeGoals}-${score.prediction.awayGoals}`
            : null,
          scoreType: score.scoreType,
          awardedPoints: score.awardedPoints,
        })),
    }));
  }
}
