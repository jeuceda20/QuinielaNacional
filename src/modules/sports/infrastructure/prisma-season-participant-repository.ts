import type {
  ParticipantResult,
  SeasonParticipantRepository,
} from "@/modules/sports/application/add-season-participant";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaSeasonParticipantRepository implements SeasonParticipantRepository {
  public constructor(
    private readonly db: Pick<
      PrismaClient,
      "$transaction" | "season" | "user" | "seasonParticipant" | "standing" | "auditLog"
    > = prisma,
  ) {}
  async add(
    seasonId: string,
    userId: string,
    actorId: string,
    now: Date,
    requestId?: string | null,
  ): Promise<ParticipantResult> {
    return this.db.$transaction(async (t) => {
      const season = await t.season.findFirst({
        where: { id: seasonId, status: "ACTIVE", archivedAt: null },
        select: { id: true },
      });
      if (!season) return "SEASON_NOT_ACTIVE";
      const user = await t.user.findFirst({
        where: { id: userId, status: "APPROVED", deletedAt: null },
        select: { id: true },
      });
      if (!user) return "USER_NOT_ELIGIBLE";
      try {
        const participant = await t.seasonParticipant.create({
          data: { seasonId, userId, joinedAt: now, isEligible: true },
        });
        await t.standing.upsert({
          where: { seasonId_userId: { seasonId, userId } },
          create: {
            seasonId,
            userId,
            position: 0,
            totalPoints: 0,
            exactCount: 0,
            partialCount: 0,
            wrongCount: 0,
            noPredictionCount: 0,
            matchesScored: 0,
            recalculatedAt: now,
          },
          update: {},
        });
        await t.auditLog.create({
          data: {
            actorUserId: actorId,
            actorRole: "ADMIN",
            action: "SEASON_PARTICIPANT_ADDED",
            entityType: "SEASON",
            entityId: seasonId,
            metadataJson: { participantId: participant.id, userId, joinedAt: now.toISOString() },
            requestId: requestId ?? null,
          },
        });
        return "ADDED";
      } catch {
        return "DUPLICATE";
      }
    });
  }
}
