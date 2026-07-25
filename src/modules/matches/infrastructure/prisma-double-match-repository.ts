import type {
  DoubleMatchRepository,
  DoubleResult,
} from "@/modules/matches/application/set-double-match";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaDoubleMatchRepository implements DoubleMatchRepository {
  public constructor(
    private readonly db: Pick<PrismaClient, "$transaction" | "match" | "auditLog"> = prisma,
  ) {}
  async set(id: string, actorId: string, now: Date): Promise<DoubleResult> {
    try {
      return await this.db.$transaction(async (t) => {
        const match = await t.match.findFirst({
          where: { id, archivedAt: null },
          select: {
            id: true,
            roundId: true,
            status: true,
            predictionClosesAt: true,
            isDoublePoints: true,
          },
        });
        if (!match) return "NOT_FOUND";
        if (match.isDoublePoints) return "SET";
        if (match.status === "PROCESSED" || match.predictionClosesAt <= now) return "CLOSED";
        if (
          await t.match.findFirst({
            where: { roundId: match.roundId, isDoublePoints: true, archivedAt: null },
          })
        )
          return "CONFLICT";
        const updated = await t.match.updateMany({
          where: {
            id: match.id,
            isDoublePoints: false,
            predictionClosesAt: { gt: now },
            status: { not: "PROCESSED" },
          },
          data: { isDoublePoints: true },
        });
        if (!updated.count) return "CLOSED";
        await t.auditLog.create({
          data: {
            actorUserId: actorId,
            actorRole: "ADMIN",
            action: "MATCH_DOUBLE_CHANGED",
            entityType: "MATCH",
            entityId: match.id,
            afterJson: { isDoublePoints: true },
          },
        });
        return "SET";
      });
    } catch {
      return "CONFLICT";
    }
  }
}
