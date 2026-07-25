import type {
  PredictionVisibilityRepository,
  VisiblePrediction,
} from "@/modules/predictions/application/get-visible-predictions";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaPredictionVisibilityRepository implements PredictionVisibilityRepository {
  public constructor(private readonly db: Pick<PrismaClient, "match" | "prediction"> = prisma) {}
  async getClosesAt(matchId: string) {
    const m = await this.db.match.findFirst({
      where: { id: matchId, archivedAt: null },
      select: { predictionClosesAt: true },
    });
    return m?.predictionClosesAt ?? null;
  }
  async getOwn(matchId: string, userId: string): Promise<VisiblePrediction[]> {
    const rows = await this.db.prediction.findMany({
      where: { matchId, userId, deletedAt: null },
      select: { userId: true, homeGoals: true, awayGoals: true },
    });
    return rows;
  }
  async getAfterClose(matchId: string): Promise<VisiblePrediction[]> {
    const rows = await this.db.prediction.findMany({
      where: { matchId, deletedAt: null },
      select: {
        userId: true,
        homeGoals: true,
        awayGoals: true,
        user: { select: { nickname: true } },
      },
    });
    return rows.map((r) => ({ ...r, nickname: r.user.nickname }));
  }
}
