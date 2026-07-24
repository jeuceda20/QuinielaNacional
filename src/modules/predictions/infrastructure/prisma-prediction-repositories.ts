import type {
  MatchResultEntity,
  PredictionEntity,
  PredictionRepository,
  PredictionScoreEntity,
  PredictionScoreRepository,
  ResultRepository,
  StandingEntity,
  StandingRepository,
} from "@/modules/predictions/domain/prediction-repositories";

import { prisma } from "@/lib/prisma";

import type {
  MatchResult,
  Prediction,
  PredictionScore,
  PrismaClient,
  Standing,
} from "@/generated/prisma/client";

export type PredictionRepositoryDatabase = Pick<
  PrismaClient,
  "matchResult" | "prediction" | "predictionScore" | "standing"
>;

const toPrediction = (value: Prediction): PredictionEntity => ({
  id: value.id,
  userId: value.userId,
  matchId: value.matchId,
  homeGoals: value.homeGoals,
  awayGoals: value.awayGoals,
  lockedAt: value.lockedAt,
});
const toScore = (value: PredictionScore): PredictionScoreEntity => ({
  id: value.id,
  seasonId: value.seasonId,
  userId: value.userId,
  matchId: value.matchId,
  scoreType: value.scoreType,
  awardedPoints: value.awardedPoints,
  resultVersion: value.resultVersion,
});
const toStanding = (value: Standing): StandingEntity => ({
  seasonId: value.seasonId,
  userId: value.userId,
  position: value.position,
  previousPosition: value.previousPosition,
  totalPoints: value.totalPoints,
  exactCount: value.exactCount,
  partialCount: value.partialCount,
});
const toResult = (value: MatchResult): MatchResultEntity => ({
  id: value.id,
  matchId: value.matchId,
  homeGoals: value.homeGoals,
  awayGoals: value.awayGoals,
  version: value.version,
});

export class PrismaPredictionRepository implements PredictionRepository {
  public constructor(private readonly database: PredictionRepositoryDatabase = prisma) {}
  public async findByUserAndMatch(
    userId: string,
    matchId: string,
  ): Promise<PredictionEntity | null> {
    const prediction = await this.database.prediction.findFirst({
      where: { userId, matchId, deletedAt: null },
    });
    return prediction ? toPrediction(prediction) : null;
  }
}

export class PrismaPredictionScoreRepository implements PredictionScoreRepository {
  public constructor(private readonly database: PredictionRepositoryDatabase = prisma) {}
  public async listBySeasonAndUser(
    seasonId: string,
    userId: string,
  ): Promise<readonly PredictionScoreEntity[]> {
    const scores = await this.database.predictionScore.findMany({
      where: { seasonId, userId },
      orderBy: { calculatedAt: "asc" },
    });
    return scores.map(toScore);
  }
}

export class PrismaStandingRepository implements StandingRepository {
  public constructor(private readonly database: PredictionRepositoryDatabase = prisma) {}
  public async listBySeason(seasonId: string): Promise<readonly StandingEntity[]> {
    const standings = await this.database.standing.findMany({
      where: { seasonId },
      orderBy: { position: "asc" },
    });
    return standings.map(toStanding);
  }
}

export class PrismaResultRepository implements ResultRepository {
  public constructor(private readonly database: PredictionRepositoryDatabase = prisma) {}
  public async findCurrentByMatch(matchId: string): Promise<MatchResultEntity | null> {
    const result = await this.database.matchResult.findFirst({
      where: { matchId, isCurrent: true },
    });
    return result ? toResult(result) : null;
  }
}
