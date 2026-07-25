import {
  calculatePredictionScore,
  PredictionScoreType,
} from "@/modules/scoring/domain/calculate-prediction-score";
import type { SeasonRecalculationRepository } from "@/modules/standings/application/recalculate-season";
import { calculateStandings } from "@/modules/standings/domain/calculate-standings";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

export class PrismaSeasonRecalculationRepository implements SeasonRecalculationRepository {
  public constructor(private readonly database: Pick<PrismaClient, "$transaction"> = prisma) {}
  async recalculate(input: Parameters<SeasonRecalculationRepository["recalculate"]>[0]) {
    return this.database.$transaction(async (tx) => {
      const season = await tx.season.findFirst({
        where: { id: input.seasonId, archivedAt: null },
        select: { id: true },
      });
      if (!season) return null;
      const [participants, matches, previous] = await Promise.all([
        tx.seasonParticipant.findMany({
          where: { seasonId: season.id, isEligible: true, excludedAt: null },
          select: { userId: true, user: { select: { nickname: true } } },
        }),
        tx.match.findMany({
          where: { seasonId: season.id, status: "PROCESSED", archivedAt: null },
          orderBy: { scheduledAt: "asc" },
          select: {
            id: true,
            isDoublePoints: true,
            resultVersion: true,
            predictions: {
              where: { deletedAt: null },
              select: { id: true, userId: true, homeGoals: true, awayGoals: true },
            },
            results: {
              where: { isCurrent: true },
              select: { id: true, homeGoals: true, awayGoals: true },
            },
          },
        }),
        tx.standing.findMany({
          where: { seasonId: season.id },
          select: { userId: true, position: true },
        }),
      ]);
      const scoreRows = matches.flatMap((match) => {
        const result = match.results[0];
        if (!result) return [];
        const byUser = new Map(
          match.predictions.map((prediction) => [prediction.userId, prediction]),
        );
        return participants.map((participant) => {
          const prediction = byUser.get(participant.userId) ?? null;
          const score = calculatePredictionScore({
            prediction,
            officialResult: result,
            isDoublePoints: match.isDoublePoints,
          });
          return {
            seasonId: season.id,
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
      });
      await tx.predictionScore.deleteMany({ where: { seasonId: season.id } });
      if (scoreRows.length) await tx.predictionScore.createMany({ data: scoreRows });
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
      for (const score of scoreRows) {
        const total = totals.get(score.userId)!;
        total.totalPoints += score.awardedPoints;
        total.matchesScored += 1;
        if (score.scoreType === PredictionScoreType.EXACT) total.exactCount++;
        if (score.scoreType === PredictionScoreType.PARTIAL) total.partialCount++;
        if (score.scoreType === PredictionScoreType.WRONG) total.wrongCount++;
        if (score.scoreType === PredictionScoreType.NO_PREDICTION) total.noPredictionCount++;
      }
      const standings = calculateStandings(
        participants.map((participant) => ({
          userId: participant.userId,
          nickname: participant.user.nickname,
          ...totals.get(participant.userId)!,
        })),
      );
      const old = new Map(previous.map((standing) => [standing.userId, standing.position]));
      await tx.standing.deleteMany({ where: { seasonId: season.id } });
      if (standings.length)
        await tx.standing.createMany({
          data: standings.map((standing) => ({
            seasonId: season.id,
            userId: standing.userId,
            position: standing.position,
            previousPosition: old.get(standing.userId) ?? null,
            ...totals.get(standing.userId)!,
            recalculatedAt: input.now,
          })),
        });
      const latest = await tx.standingSnapshot.aggregate({
        where: { seasonId: season.id },
        _max: { snapshotVersion: true },
      });
      if (standings.length)
        await tx.standingSnapshot.createMany({
          data: standings.map((standing) => ({
            seasonId: season.id,
            userId: standing.userId,
            position: standing.position,
            totalPoints: standing.totalPoints,
            exactCount: standing.exactCount,
            partialCount: standing.partialCount,
            snapshotVersion: (latest._max.snapshotVersion ?? 0) + 1,
          })),
        });
      await tx.auditLog.create({
        data: {
          actorUserId: input.actorId,
          actorRole: "SUPER_ADMIN",
          action: "SEASON_RECALCULATED",
          entityType: "SEASON",
          entityId: season.id,
          metadataJson: {
            matches: matches.length,
            scores: scoreRows.length,
            standings: standings.length,
          },
          requestId: input.requestId,
        },
      });
      return { matches: matches.length, scores: scoreRows.length, standings: standings.length };
    });
  }
}
