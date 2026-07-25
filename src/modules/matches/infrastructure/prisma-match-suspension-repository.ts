import type { MatchSuspensionRepository } from "@/modules/matches/application/manage-match-suspension";

import { prisma } from "@/lib/prisma";

import type { MatchStatus, PrismaClient } from "@/generated/prisma/client";
export class PrismaMatchSuspensionRepository implements MatchSuspensionRepository {
  public constructor(
    private readonly db: Pick<PrismaClient, "$transaction" | "match" | "auditLog"> = prisma,
  ) {}
  async change(
    id: string,
    status: "SUSPENDED" | "RESUMED",
    actorId: string,
    reason: string | null,
  ) {
    return this.db.$transaction(async (t) => {
      const from: MatchStatus[] =
        status === "SUSPENDED" ? ["SCHEDULED", "RESCHEDULED", "CLOSED"] : ["SUSPENDED"];
      const m = await t.match.findFirst({
        where: { id, archivedAt: null, status: { in: from } },
        select: { id: true, status: true },
      });
      if (!m) {
        const any = await t.match.findFirst({ where: { id, archivedAt: null } });
        return any ? ("INVALID_STATE" as const) : ("NOT_FOUND" as const);
      }
      const u = await t.match.updateMany({
        where: { id: m.id, status: m.status },
        data: { status },
      });
      if (!u.count) return "INVALID_STATE" as const;
      await t.auditLog.create({
        data: {
          actorUserId: actorId,
          actorRole: "ADMIN",
          action: status === "SUSPENDED" ? "MATCH_SUSPENDED" : "MATCH_RESUMED",
          entityType: "MATCH",
          entityId: m.id,
          beforeJson: { status: m.status },
          afterJson: { status },
          metadataJson: { reason },
        },
      });
      return "CHANGED" as const;
    });
  }
}
