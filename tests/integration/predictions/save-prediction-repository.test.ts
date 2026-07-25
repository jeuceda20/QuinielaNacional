import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

import { PrismaSavePredictionRepository } from "@/modules/predictions/infrastructure/prisma-save-prediction-repository";

import { getTestDatabaseUrl } from "../../helpers/test-database";

import { PrismaClient } from "@/generated/prisma/client";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: getTestDatabaseUrl() }),
});

const now = new Date("2026-08-15T00:00:00.000Z");
const created = {
  matchIds: [] as string[],
  roundIds: [] as string[],
  seasonIds: [] as string[],
  teamIds: [] as string[],
  userIds: [] as string[],
};

async function createMatch() {
  const suffix = randomUUID();
  const [homeTeam, awayTeam] = await Promise.all([
    prisma.team.create({
      data: { name: `Home ${suffix}`, shortName: "HOM", slug: `home-${suffix}`, displayOrder: 1 },
    }),
    prisma.team.create({
      data: { name: `Away ${suffix}`, shortName: "AWY", slug: `away-${suffix}`, displayOrder: 2 },
    }),
  ]);
  const season = await prisma.season.create({
    data: { name: `Season ${suffix}`, slug: `season-${suffix}` },
  });
  const round = await prisma.round.create({
    data: { seasonId: season.id, name: "Round", slug: `round-${suffix}` },
  });
  const match = await prisma.match.create({
    data: {
      seasonId: season.id,
      roundId: round.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      scheduledAt: new Date(now.getTime() + 60 * 60 * 1000),
      predictionClosesAt: new Date(now.getTime() + 55 * 60 * 1000),
    },
  });
  created.teamIds.push(homeTeam.id, awayTeam.id);
  created.seasonIds.push(season.id);
  created.roundIds.push(round.id);
  created.matchIds.push(match.id);

  return { season, match };
}

async function createUser() {
  const suffix = randomUUID();
  const user = await prisma.user.create({
    data: {
      firstName: "Test",
      lastName: "User",
      nickname: `tester-${suffix}`,
      nicknameNormalized: `tester-${suffix}`,
      email: `tester-${suffix}@example.invalid`,
      emailNormalized: `tester-${suffix}@example.invalid`,
      passwordHash: "hash",
      status: "APPROVED",
    },
  });
  created.userIds.push(user.id);
  return user;
}

afterEach(async () => {
  const matchIds = created.matchIds.splice(0);
  await prisma.prediction.deleteMany({ where: { matchId: { in: matchIds } } });
  await prisma.seasonParticipant.deleteMany({
    where: { seasonId: { in: created.seasonIds } },
  });
  await prisma.match.deleteMany({ where: { id: { in: matchIds } } });
  await prisma.round.deleteMany({ where: { id: { in: created.roundIds.splice(0) } } });
  await prisma.season.deleteMany({ where: { id: { in: created.seasonIds.splice(0) } } });
  await prisma.team.deleteMany({ where: { id: { in: created.teamIds.splice(0) } } });
  await prisma.user.deleteMany({ where: { id: { in: created.userIds.splice(0) } } });
});

describe("PrismaSavePredictionRepository", () => {
  afterAll(() => prisma.$disconnect());

  it("persists only an eligible participant prediction and updates the same record", async () => {
    const { season, match } = await createMatch();
    const user = await createUser();
    const repository = new PrismaSavePredictionRepository(prisma);

    await expect(
      repository.save({ userId: user.id, matchId: match.id, homeGoals: 1, awayGoals: 0, now }),
    ).resolves.toBe("NOT_PARTICIPANT");

    await prisma.seasonParticipant.create({ data: { seasonId: season.id, userId: user.id } });
    await expect(
      repository.save({ userId: user.id, matchId: match.id, homeGoals: 1, awayGoals: 0, now }),
    ).resolves.toBe("SAVED");
    await expect(
      repository.save({ userId: user.id, matchId: match.id, homeGoals: 2, awayGoals: 1, now }),
    ).resolves.toBe("SAVED");

    await expect(prisma.prediction.findMany({ where: { matchId: match.id } })).resolves.toEqual([
      expect.objectContaining({ userId: user.id, matchId: match.id, homeGoals: 2, awayGoals: 1 }),
    ]);
  });

  it("rejects a prediction at the exact server-side closing time", async () => {
    const { season, match } = await createMatch();
    const user = await createUser();
    await prisma.seasonParticipant.create({ data: { seasonId: season.id, userId: user.id } });

    await expect(
      new PrismaSavePredictionRepository(prisma).save({
        userId: user.id,
        matchId: match.id,
        homeGoals: 0,
        awayGoals: 0,
        now: match.predictionClosesAt,
      }),
    ).resolves.toBe("MATCH_CLOSED");
    await expect(prisma.prediction.count({ where: { matchId: match.id } })).resolves.toBe(0);
  });
});
