import type { ProcessMatchResultRepository } from "@/modules/results/application/process-match-result";
import { isConcurrentLockError } from "@/modules/results/infrastructure/operational-lock";
import {
  calculatePredictionScore,
  PredictionScoreType,
} from "@/modules/scoring/domain/calculate-prediction-score";
import { calculateStandings } from "@/modules/standings/domain/calculate-standings";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

const lockExpiryMilliseconds = 5 * 60 * 1000;

export class PrismaProcessMatchResultRepository implements ProcessMatchResultRepository {
  public constructor(
    private readonly database: Pick<PrismaClient, "$transaction" | "operationalLock"> = prisma,
  ) {}

  public async process(input: Parameters<ProcessMatchResultRepository["process"]>[0]) {
    const lock = { lockType: "MATCH_PROCESSING" as const, resourceKey: input.matchId };
    try {
      await this.database.operationalLock.deleteMany({
        where: { ...lock, expiresAt: { lte: input.now } },
      });
      await this.database.operationalLock.create({
        data: {
          ...lock,
          acquiredById: input.actorId,
          requestId: input.requestId,
          acquiredAt: input.now,
          expiresAt: new Date(input.now.getTime() + lockExpiryMilliseconds),
        },
      });
    } catch (error) {
      if (isConcurrentLockError(error)) return "CONCURRENT_PROCESSING" as const;
      throw error;
    }
    try {
      return await this.database.$transaction(async (tx) => {
        const match = await tx.match.findFirst({
          where: { id: input.matchId, archivedAt: null },
          select: {
            id: true,
            seasonId: true,
            status: true,
            isDoublePoints: true,
            resultVersion: true,
          },
        });
        if (!match) return "MATCH_NOT_FOUND" as const;
        if (match.status === "CANCELLED") return "MATCH_CANCELLED" as const;
        if (match.status === "PROCESSED") return "MATCH_ALREADY_PROCESSED" as const;
        if (match.status !== "FINISHED_PENDING") return "MATCH_NOT_READY" as const;

        const result = await tx.matchResult.create({
          data: {
            matchId: match.id,
            homeGoals: input.homeGoals,
            awayGoals: input.awayGoals,
            version: match.resultVersion,
            recordedById: input.actorId,
          },
        });
        const [predictions, participants, previousStandings] = await Promise.all([
          tx.prediction.findMany({
            where: { matchId: match.id, deletedAt: null },
            select: { id: true, userId: true, homeGoals: true, awayGoals: true },
          }),
          tx.seasonParticipant.findMany({
            where: { seasonId: match.seasonId, isEligible: true, excludedAt: null },
            select: { userId: true, user: { select: { nickname: true } } },
          }),
          tx.standing.findMany({ where: { seasonId: match.seasonId } }),
        ]);
        const predictionByUser = new Map(
          predictions.map((prediction) => [prediction.userId, prediction]),
        );
        const scores = participants.map((participant) => {
          const prediction = predictionByUser.get(participant.userId) ?? null;
          const score = calculatePredictionScore({
            prediction,
            officialResult: result,
            isDoublePoints: match.isDoublePoints,
          });
          return {
            seasonId: match.seasonId,
            userId: participant.userId,
            matchId: match.id,
            predictionId: prediction?.id,
            matchResultId: result.id,
            scoreType: score.scoreType,
            basePoints: score.basePoints,
            multiplier: score.multiplier,
            awardedPoints: score.awardedPoints,
            resultVersion: match.resultVersion,
            calculatedById: input.actorId,
          };
        });
        if (scores.length) await tx.predictionScore.createMany({ data: scores });

        const allScores = await tx.predictionScore.findMany({
          where: { seasonId: match.seasonId },
          select: { userId: true, awardedPoints: true, scoreType: true },
        });
        const totals = new Map(
          participants.map((participant) => [
            participant.userId,
            {
              totalPoints: 0,
              exactCount: 0,
              partialCount: 0,
              wrongCount: 0,
              noPredictionCount: 0,
              matchesScored: 0,
            },
          ]),
        );
        for (const score of allScores) {
          const total = totals.get(score.userId);
          if (!total) continue;
          total.totalPoints += score.awardedPoints;
          total.matchesScored += 1;
          if (score.scoreType === PredictionScoreType.EXACT) total.exactCount += 1;
          if (score.scoreType === PredictionScoreType.PARTIAL) total.partialCount += 1;
          if (score.scoreType === PredictionScoreType.WRONG) total.wrongCount += 1;
          if (score.scoreType === PredictionScoreType.NO_PREDICTION) total.noPredictionCount += 1;
        }
        const standings = calculateStandings(
          participants.map((participant) => ({
            userId: participant.userId,
            nickname: participant.user.nickname,
            ...totals.get(participant.userId)!,
          })),
        );
        const previousByUser = new Map(
          previousStandings.map((standing) => [standing.userId, standing]),
        );
        for (const standing of standings) {
          const total = totals.get(standing.userId)!;
          await tx.standing.upsert({
            where: { seasonId_userId: { seasonId: match.seasonId, userId: standing.userId } },
            create: {
              seasonId: match.seasonId,
              userId: standing.userId,
              position: standing.position,
              totalPoints: total.totalPoints,
              exactCount: total.exactCount,
              partialCount: total.partialCount,
              wrongCount: total.wrongCount,
              noPredictionCount: total.noPredictionCount,
              matchesScored: total.matchesScored,
              recalculatedAt: input.now,
            },
            update: {
              position: standing.position,
              previousPosition: previousByUser.get(standing.userId)?.position ?? null,
              totalPoints: total.totalPoints,
              exactCount: total.exactCount,
              partialCount: total.partialCount,
              wrongCount: total.wrongCount,
              noPredictionCount: total.noPredictionCount,
              matchesScored: total.matchesScored,
              recalculatedAt: input.now,
              version: { increment: 1 },
            },
          });
        }
        const latestSnapshot = await tx.standingSnapshot.aggregate({
          where: { seasonId: match.seasonId },
          _max: { snapshotVersion: true },
        });
        const snapshotVersion = (latestSnapshot._max.snapshotVersion ?? 0) + 1;
        if (standings.length)
          await tx.standingSnapshot.createMany({
            data: standings.map((standing) => ({
              seasonId: match.seasonId,
              userId: standing.userId,
              triggerMatchId: match.id,
              position: standing.position,
              totalPoints: standing.totalPoints,
              exactCount: standing.exactCount,
              partialCount: standing.partialCount,
              snapshotVersion,
            })),
          });
        await tx.match.update({
          where: { id: match.id },
          data: {
            status: "PROCESSED",
            officialHomeGoals: result.homeGoals,
            officialAwayGoals: result.awayGoals,
            processedAt: input.now,
            processedById: input.actorId,
          },
        });
        await tx.auditLog.create({
          data: {
            actorUserId: input.actorId,
            actorRole: input.actorRole,
            action: "MATCH_PROCESSED",
            entityType: "MATCH",
            entityId: match.id,
            afterJson: {
              homeGoals: result.homeGoals,
              awayGoals: result.awayGoals,
              version: result.version,
            },
            metadataJson: { predictionCount: predictions.length },
            ipAddress: input.ipAddress,
            userAgent: input.userAgent,
            requestId: input.requestId,
          },
        });
        return "PROCESSED" as const;
      });
    } finally {
      await this.database.operationalLock.deleteMany({ where: lock });
    }
  }
}
