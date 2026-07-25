import type { MatchCancellationRepository } from "@/modules/matches/application/cancel-match";

import { prisma } from "@/lib/prisma";

import type { MatchStatus, PrismaClient } from "@/generated/prisma/client";
export class PrismaMatchCancellationRepository implements MatchCancellationRepository {
  public constructor(
    private readonly db: Pick<PrismaClient, "$transaction" | "match" | "auditLog"> = prisma,
  ) {}
  async cancel(i: Parameters<MatchCancellationRepository["cancel"]>[0]) {
    return this.db.$transaction(async (t) => {
      const allowed: MatchStatus[] = ["SCHEDULED", "RESCHEDULED", "SUSPENDED", "RESUMED"];
      const match = await t.match.findFirst({
        where: { id: i.matchId, archivedAt: null, status: { in: allowed } },
        select: { id: true, status: true, isDoublePoints: true },
      });
      if (!match) {
        const any = await t.match.findFirst({ where: { id: i.matchId, archivedAt: null } });
        return any ? ("INVALID_STATE" as const) : ("NOT_FOUND" as const);
      }
      const updated = await t.match.updateMany({
        where: { id: match.id, status: match.status },
        data: { status: "CANCELLED", notes: i.reason },
      });
      if (!updated.count) return "INVALID_STATE" as const;
      await t.auditLog.create({
        data: {
          actorUserId: i.actorId,
          actorRole: "ADMIN",
          action: "MATCH_CANCELLED",
          entityType: "MATCH",
          entityId: match.id,
          beforeJson: { status: match.status, isDoublePoints: match.isDoublePoints },
          afterJson: { status: "CANCELLED" },
          metadataJson: { reason: i.reason },
        },
      });
      return "CANCELLED" as const;
    });
  }
}
