import type {
  PendingPredictionMatch,
  PendingPredictionRepository,
} from "@/modules/predictions/application/get-pending-predictions";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaPendingPredictionRepository implements PendingPredictionRepository {
  public constructor(private readonly db: Pick<PrismaClient, "match"> = prisma) {}
  async list(userId: string, now: Date): Promise<readonly PendingPredictionMatch[]> {
    const rows = await this.db.match.findMany({
      where: {
        archivedAt: null,
        status: { in: ["SCHEDULED", "RESCHEDULED", "RESUMED"] },
        predictionClosesAt: { gt: now },
        season: {
          status: "ACTIVE",
          archivedAt: null,
          participants: { some: { userId, isEligible: true, excludedAt: null } },
        },
        predictions: { none: { userId, deletedAt: null } },
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        round: { select: { name: true } },
        homeTeam: { select: { name: true, logoPath: true } },
        awayTeam: { select: { name: true, logoPath: true } },
      },
    });
    return rows.map((r) => ({
      id: r.id,
      scheduledAt: r.scheduledAt,
      predictionClosesAt: r.predictionClosesAt,
      isDoublePoints: r.isDoublePoints,
      roundName: r.round.name,
      homeTeam: r.homeTeam,
      awayTeam: r.awayTeam,
    }));
  }
}
