import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

import { RescheduleMatch } from "@/modules/matches/application/reschedule-match";
import { PrismaMatchRescheduleRepository } from "@/modules/matches/infrastructure/prisma-match-reschedule-repository";

import { getTestDatabaseUrl } from "../../helpers/test-database";

import { PrismaClient } from "@/generated/prisma/client";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: getTestDatabaseUrl() }),
});
const created = {
  matchIds: [] as string[],
  roundIds: [] as string[],
  seasonIds: [] as string[],
  teamIds: [] as string[],
  userIds: [] as string[],
};

afterEach(async () => {
  const matchIds = created.matchIds.splice(0);
  await prisma.prediction.deleteMany({ where: { matchId: { in: matchIds } } });
  await prisma.matchScheduleHistory.deleteMany({ where: { matchId: { in: matchIds } } });
  await prisma.auditLog.deleteMany({ where: { entityId: { in: matchIds } } });
  await prisma.match.deleteMany({ where: { id: { in: matchIds } } });
  await prisma.round.deleteMany({ where: { id: { in: created.roundIds.splice(0) } } });
  await prisma.season.deleteMany({ where: { id: { in: created.seasonIds.splice(0) } } });
  await prisma.team.deleteMany({ where: { id: { in: created.teamIds.splice(0) } } });
  await prisma.user.deleteMany({ where: { id: { in: created.userIds.splice(0) } } });
});
afterAll(() => prisma.$disconnect());

describe("PrismaMatchRescheduleRepository", () => {
  it("reschedules a match, preserves predictions, and creates history and audit records", async () => {
    const suffix = randomUUID(),
      now = new Date("2026-08-15T00:00:00.000Z"),
      original = new Date("2026-08-16T18:00:00.000Z"),
      scheduledAt = new Date("2026-08-17T20:00:00.000Z");
    const admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "Test",
        nickname: `admin-${suffix}`,
        nicknameNormalized: `admin-${suffix}`,
        email: `admin-${suffix}@example.invalid`,
        emailNormalized: `admin-${suffix}@example.invalid`,
        passwordHash: "hash",
        role: "ADMIN",
        status: "APPROVED",
      },
    });
    const [home, away] = await Promise.all([
      prisma.team.create({
        data: { name: `Home ${suffix}`, shortName: "H", slug: `home-${suffix}`, displayOrder: 1 },
      }),
      prisma.team.create({
        data: { name: `Away ${suffix}`, shortName: "A", slug: `away-${suffix}`, displayOrder: 2 },
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
        homeTeamId: home.id,
        awayTeamId: away.id,
        scheduledAt: original,
        predictionClosesAt: new Date(original.getTime() - 300000),
      },
    });
    created.userIds.push(admin.id);
    created.teamIds.push(home.id, away.id);
    created.seasonIds.push(season.id);
    created.roundIds.push(round.id);
    created.matchIds.push(match.id);
    await prisma.prediction.create({
      data: { userId: admin.id, matchId: match.id, homeGoals: 1, awayGoals: 0 },
    });

    await new RescheduleMatch(new PrismaMatchRescheduleRepository(prisma)).execute(
      { id: admin.id, role: "ADMIN", status: "APPROVED" },
      { matchId: match.id, scheduledAt, reason: "Cambio oficial" },
      now,
    );

    await expect(prisma.match.findUnique({ where: { id: match.id } })).resolves.toMatchObject({
      scheduledAt,
      predictionClosesAt: new Date(scheduledAt.getTime() - 300000),
      status: "RESCHEDULED",
    });
    await expect(prisma.prediction.count({ where: { matchId: match.id } })).resolves.toBe(1);
    await expect(prisma.matchScheduleHistory.count({ where: { matchId: match.id } })).resolves.toBe(
      1,
    );
    await expect(
      prisma.auditLog.count({ where: { entityId: match.id, action: "MATCH_RESCHEDULED" } }),
    ).resolves.toBe(1);
  });
});
