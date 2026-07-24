import { describe, expect, it, vi } from "vitest";

import {
  type PredictionRepositoryDatabase,
  PrismaPredictionRepository,
  PrismaPredictionScoreRepository,
  PrismaResultRepository,
  PrismaStandingRepository,
} from "@/modules/predictions/infrastructure/prisma-prediction-repositories";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

function createDatabase() {
  return {
    prediction: { findFirst: vi.fn() },
    predictionScore: { findMany: vi.fn() },
    standing: { findMany: vi.fn() },
    matchResult: { findFirst: vi.fn() },
  } as unknown as PredictionRepositoryDatabase;
}

describe("Prisma prediction repositories", () => {
  it("finds only the requesting user's non-deleted prediction", async () => {
    const database = createDatabase();
    (database.prediction.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    await expect(
      new PrismaPredictionRepository(database).findByUserAndMatch("user", "match"),
    ).resolves.toBeNull();
    expect(database.prediction.findFirst).toHaveBeenCalledWith({
      where: { userId: "user", matchId: "match", deletedAt: null },
    });
  });

  it("orders score and standing queries deterministically", async () => {
    const database = createDatabase();
    (database.predictionScore.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (database.standing.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    await new PrismaPredictionScoreRepository(database).listBySeasonAndUser("season", "user");
    await new PrismaStandingRepository(database).listBySeason("season");
    expect(database.predictionScore.findMany).toHaveBeenCalledWith({
      where: { seasonId: "season", userId: "user" },
      orderBy: { calculatedAt: "asc" },
    });
    expect(database.standing.findMany).toHaveBeenCalledWith({
      where: { seasonId: "season" },
      orderBy: { position: "asc" },
    });
  });

  it("finds only the current result of a match", async () => {
    const database = createDatabase();
    (database.matchResult.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    await expect(
      new PrismaResultRepository(database).findCurrentByMatch("match"),
    ).resolves.toBeNull();
    expect(database.matchResult.findFirst).toHaveBeenCalledWith({
      where: { matchId: "match", isCurrent: true },
    });
  });
});
