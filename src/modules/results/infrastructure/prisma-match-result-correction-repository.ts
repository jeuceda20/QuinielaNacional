import type { MatchResultCorrectionRepository } from "@/modules/results/application/correct-match-result";
import {
  calculatePredictionScore,
  PredictionScoreType,
} from "@/modules/scoring/domain/calculate-prediction-score";
import { calculateStandings } from "@/modules/standings/domain/calculate-standings";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

export class PrismaMatchResultCorrectionRepository implements MatchResultCorrectionRepository {
  public constructor(
    private readonly database: Pick<PrismaClient, "$transaction" | "user"> = prisma,
  ) {}
  async getPasswordHash(userId: string) {
    const user = await this.database.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { passwordHash: true },
    });
    return user?.passwordHash ?? null;
  }
  async correct(input: Parameters<MatchResultCorrectionRepository["correct"]>[0]) {
    return this.database.$transaction(async (tx) => {
      const match = await tx.match.findFirst({
        where: { id: input.matchId, archivedAt: null },
        select: {
          id: true,
          seasonId: true,
          status: true,
          resultVersion: true,
          isDoublePoints: true,
        },
      });
      if (!match) return "MATCH_NOT_FOUND" as const;
      if (match.status !== "PROCESSED") return "MATCH_NOT_PROCESSED" as const;
      const previous = await tx.matchResult.findFirst({
        where: { matchId: match.id, isCurrent: true },
      });
      if (!previous) return "MATCH_NOT_PROCESSED" as const;
      const version = match.resultVersion + 1;
      await tx.matchResult.update({ where: { id: previous.id }, data: { isCurrent: false } });
      const next = await tx.matchResult.create({
        data: {
          matchId: match.id,
          homeGoals: input.homeGoals,
          awayGoals: input.awayGoals,
          version,
          isCurrent: true,
          recordedById: input.actorId,
          correctionReason: input.reason,
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
      const byUser = new Map(predictions.map((prediction) => [prediction.userId, prediction]));
      const scores = participants.map((participant) => {
        const prediction = byUser.get(participant.userId) ?? null;
        const score = calculatePredictionScore({
          prediction,
          officialResult: next,
          isDoublePoints: match.isDoublePoints,
        });
        return {
          seasonId: match.seasonId,
          userId: participant.userId,
          matchId: match.id,
          predictionId: prediction?.id,
          matchResultId: next.id,
          scoreType: score.scoreType,
          basePoints: score.basePoints,
          multiplier: score.multiplier,
          awardedPoints: score.awardedPoints,
          resultVersion: version,
          calculatedById: input.actorId,
        };
      });
      if (scores.length) await tx.predictionScore.createMany({ data: scores });
      const allScores = await tx.predictionScore.findMany({
        where: { seasonId: match.seasonId },
        select: {
          userId: true,
          awardedPoints: true,
          basePoints: true,
          scoreType: true,
          resultVersion: true,
          match: { select: { resultVersion: true, isDoublePoints: true } },
        },
      });
      const totals = new Map(
        participants.map((participant) => [
          participant.userId,
          {
            totalPoints: 0,
            doublePoints: 0,
            exactCount: 0,
            doubleExactCount: 0,
            partialCount: 0,
            wrongCount: 0,
            noPredictionCount: 0,
            matchesScored: 0,
          },
        ]),
      );
      for (const score of allScores) {
        if (score.resultVersion !== score.match.resultVersion) continue;
        const total = totals.get(score.userId);
        if (!total) continue;
        total.totalPoints += score.awardedPoints;
        if (score.match.isDoublePoints) {
            total.doublePoints += score.awardedPoints - score.basePoints;
          if (score.scoreType === PredictionScoreType.EXACT) total.doubleExactCount += 1;
        }
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
      const old = new Map(
        previousStandings.map((standing) => [standing.userId, standing.position]),
      );
      for (const standing of standings) {
        const total = totals.get(standing.userId)!;
        await tx.standing.upsert({
          where: { seasonId_userId: { seasonId: match.seasonId, userId: standing.userId } },
          create: {
            seasonId: match.seasonId,
            userId: standing.userId,
            position: standing.position,
            ...total,
            recalculatedAt: input.now,
          },
          update: {
            position: standing.position,
            previousPosition: old.get(standing.userId) ?? null,
            ...total,
            recalculatedAt: input.now,
            version: { increment: 1 },
          },
        });
      }
      const latest = await tx.standingSnapshot.aggregate({
        where: { seasonId: match.seasonId },
        _max: { snapshotVersion: true },
      });
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
            snapshotVersion: (latest._max.snapshotVersion ?? 0) + 1,
          })),
        });
      await tx.match.update({
        where: { id: match.id },
        data: {
          officialHomeGoals: next.homeGoals,
          officialAwayGoals: next.awayGoals,
          resultVersion: version,
          processedAt: input.now,
          processedById: input.actorId,
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: input.actorId,
          actorRole: "SUPER_ADMIN",
          action: "MATCH_RESULT_CORRECTED",
          entityType: "MATCH",
          entityId: match.id,
          beforeJson: {
            homeGoals: previous.homeGoals,
            awayGoals: previous.awayGoals,
            version: previous.version,
          },
          afterJson: { homeGoals: next.homeGoals, awayGoals: next.awayGoals, version },
          metadataJson: { reason: input.reason },
          requestId: input.requestId,
        },
      });
      return "CORRECTED" as const;
    });
  }
}
