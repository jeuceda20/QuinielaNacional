import type { MatchRescheduleRepository } from "@/modules/matches/application/reschedule-match";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaMatchRescheduleRepository implements MatchRescheduleRepository {
  public constructor(
    private readonly db: Pick<
      PrismaClient,
      "$transaction" | "match" | "matchScheduleHistory" | "auditLog"
    > = prisma,
  ) {}
  async reschedule(i: Parameters<MatchRescheduleRepository["reschedule"]>[0]) {
    return this.db.$transaction(async (t) => {
      const m = await t.match.findFirst({
        where: { id: i.matchId, archivedAt: null },
        select: { id: true, status: true, scheduledAt: true, predictionClosesAt: true },
      });
      if (!m) return "NOT_FOUND" as const;
      if (m.status === "PROCESSED" || m.status === "CANCELLED") return "INVALID_STATE" as const;
      await t.matchScheduleHistory.create({
        data: {
          matchId: m.id,
          previousScheduledAt: m.scheduledAt,
          newScheduledAt: i.scheduledAt,
          previousClosesAt: m.predictionClosesAt,
          newClosesAt: i.newClosesAt,
          reason: i.reason,
          changedById: i.actorId,
          createdAt: i.now,
        },
      });
      await t.match.update({
        where: { id: m.id },
        data: {
          scheduledAt: i.scheduledAt,
          originalScheduledAt: m.scheduledAt,
          predictionClosesAt: i.newClosesAt,
          status: "RESCHEDULED",
        },
      });
      await t.auditLog.create({
        data: {
          actorUserId: i.actorId,
          actorRole: "ADMIN",
          action: "MATCH_RESCHEDULED",
          entityType: "MATCH",
          entityId: m.id,
          beforeJson: { scheduledAt: m.scheduledAt.toISOString() },
          afterJson: {
            scheduledAt: i.scheduledAt.toISOString(),
            predictionClosesAt: i.newClosesAt.toISOString(),
          },
          metadataJson: { reason: i.reason },
        },
      });
      return "RESCHEDULED" as const;
    });
  }
}
