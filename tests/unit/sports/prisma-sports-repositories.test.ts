import { describe, expect, it, vi } from "vitest";

import {
  PrismaMatchRepository,
  PrismaRoundRepository,
  PrismaSeasonRepository,
  PrismaTeamRepository,
  type SportsRepositoryDatabase,
} from "@/modules/sports/infrastructure/prisma-sports-repositories";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

function createDatabase() {
  return {
    team: { findFirst: vi.fn(), findMany: vi.fn() },
    season: { findFirst: vi.fn() },
    round: { findFirst: vi.fn(), findMany: vi.fn() },
    match: { findFirst: vi.fn(), findMany: vi.fn() },
  } as unknown as SportsRepositoryDatabase;
}

describe("Prisma sports repositories", () => {
  it("queries active teams in display order", async () => {
    const database = createDatabase();
    const repository = new PrismaTeamRepository(database);
    (database.team.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await expect(repository.listActive()).resolves.toEqual([]);
    expect(database.team.findMany).toHaveBeenCalledWith({
      where: { isActive: true, deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
  });

  it("queries the active non-archived season", async () => {
    const database = createDatabase();
    const repository = new PrismaSeasonRepository(database);
    (database.season.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(repository.findActive()).resolves.toBeNull();
    expect(database.season.findFirst).toHaveBeenCalledWith({
      where: { status: "ACTIVE", archivedAt: null },
    });
  });

  it("lists non-archived rounds by sequence", async () => {
    const database = createDatabase();
    const repository = new PrismaRoundRepository(database);
    (database.round.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await expect(repository.listBySeason("season-id")).resolves.toEqual([]);
    expect(database.round.findMany).toHaveBeenCalledWith({
      where: { seasonId: "season-id", archivedAt: null },
      orderBy: [{ sequence: "asc" }, { createdAt: "asc" }],
    });
  });

  it("lists non-archived matches by scheduled time", async () => {
    const database = createDatabase();
    const repository = new PrismaMatchRepository(database);
    (database.match.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await expect(repository.listByRound("round-id")).resolves.toEqual([]);
    expect(database.match.findMany).toHaveBeenCalledWith({
      where: { roundId: "round-id", archivedAt: null },
      orderBy: { scheduledAt: "asc" },
    });
  });
});
