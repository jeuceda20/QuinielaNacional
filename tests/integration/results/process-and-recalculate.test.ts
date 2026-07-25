import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

import { ProcessMatchResultService } from "@/modules/results/application/process-match-result";
import { PrismaProcessMatchResultRepository } from "@/modules/results/infrastructure/prisma-process-match-result-repository";
import { RecalculateSeasonService } from "@/modules/standings/application/recalculate-season";
import { PrismaSeasonRecalculationRepository } from "@/modules/standings/infrastructure/prisma-season-recalculation-repository";

import { createRequestContext } from "@/lib/request-context";

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
  const seasonIds = created.seasonIds.splice(0);
  await prisma.predictionScore.deleteMany({ where: { matchId: { in: matchIds } } });
  await prisma.standingSnapshot.deleteMany({ where: { seasonId: { in: seasonIds } } });
  await prisma.standing.deleteMany({ where: { seasonId: { in: seasonIds } } });
  await prisma.matchResult.deleteMany({ where: { matchId: { in: matchIds } } });
  await prisma.prediction.deleteMany({ where: { matchId: { in: matchIds } } });
  await prisma.auditLog.deleteMany({
    where: { entityId: { in: [...matchIds, ...seasonIds] } },
  });
  await prisma.match.deleteMany({ where: { id: { in: matchIds } } });
  await prisma.seasonParticipant.deleteMany({ where: { seasonId: { in: seasonIds } } });
  await prisma.round.deleteMany({ where: { id: { in: created.roundIds.splice(0) } } });
  await prisma.season.deleteMany({ where: { id: { in: seasonIds } } });
  await prisma.team.deleteMany({ where: { id: { in: created.teamIds.splice(0) } } });
  await prisma.user.deleteMany({ where: { id: { in: created.userIds.splice(0) } } });
});
afterAll(() => prisma.$disconnect());

describe("result processing and season recalculation", () => {
  it("persists scores, standings, snapshots, and audit records through both workflows", async () => {
    const suffix = randomUUID();
    const now = new Date("2026-08-20T12:00:00.000Z");
    const [admin, participant] = await Promise.all([
      prisma.user.create({
        data: {
          firstName: "Admin",
          lastName: "Test",
          nickname: `admin-${suffix}`,
          nicknameNormalized: `admin-${suffix}`,
          email: `admin-${suffix}@example.invalid`,
          emailNormalized: `admin-${suffix}@example.invalid`,
          passwordHash: "hash",
          role: "SUPER_ADMIN",
          status: "APPROVED",
        },
      }),
      prisma.user.create({
        data: {
          firstName: "Participant",
          lastName: "Test",
          nickname: `participant-${suffix}`,
          nicknameNormalized: `participant-${suffix}`,
          email: `participant-${suffix}@example.invalid`,
          emailNormalized: `participant-${suffix}@example.invalid`,
          passwordHash: "hash",
          status: "APPROVED",
        },
      }),
    ]);
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
        scheduledAt: new Date("2026-08-19T18:00:00.000Z"),
        predictionClosesAt: new Date("2026-08-19T17:55:00.000Z"),
        status: "FINISHED_PENDING",
      },
    });
    created.userIds.push(admin.id, participant.id);
    created.teamIds.push(home.id, away.id);
    created.seasonIds.push(season.id);
    created.roundIds.push(round.id);
    created.matchIds.push(match.id);
    await prisma.seasonParticipant.createMany({
      data: [
        { seasonId: season.id, userId: admin.id },
        { seasonId: season.id, userId: participant.id },
      ],
    });
    await prisma.prediction.create({
      data: { userId: admin.id, matchId: match.id, homeGoals: 2, awayGoals: 1 },
    });
    const context = createRequestContext({
      requestId: `integration-${suffix}`,
      userId: admin.id,
      role: "SUPER_ADMIN",
    });

    await new ProcessMatchResultService(new PrismaProcessMatchResultRepository(prisma)).execute(
      context,
      { matchId: match.id, homeGoals: 2, awayGoals: 1 },
      now,
    );

    await expect(prisma.match.findUnique({ where: { id: match.id } })).resolves.toMatchObject({
      status: "PROCESSED",
      officialHomeGoals: 2,
      officialAwayGoals: 1,
      processedById: admin.id,
    });
    await expect(prisma.predictionScore.count({ where: { matchId: match.id } })).resolves.toBe(2);
    await expect(
      prisma.standing.findUnique({
        where: { seasonId_userId: { seasonId: season.id, userId: admin.id } },
      }),
    ).resolves.toMatchObject({ totalPoints: 3, exactCount: 1, matchesScored: 1 });
    await expect(
      prisma.standing.findUnique({
        where: { seasonId_userId: { seasonId: season.id, userId: participant.id } },
      }),
    ).resolves.toMatchObject({ totalPoints: 0, noPredictionCount: 1, matchesScored: 1 });
    await expect(
      prisma.auditLog.count({ where: { entityId: match.id, action: "MATCH_PROCESSED" } }),
    ).resolves.toBe(1);

    await prisma.standing.update({
      where: { seasonId_userId: { seasonId: season.id, userId: admin.id } },
      data: { totalPoints: 0 },
    });
    await expect(
      new RecalculateSeasonService(new PrismaSeasonRecalculationRepository(prisma)).execute(
        context,
        season.id,
        new Date("2026-08-20T12:01:00.000Z"),
      ),
    ).resolves.toEqual({ matches: 1, scores: 2, standings: 2 });
    await expect(
      prisma.standing.findUnique({
        where: { seasonId_userId: { seasonId: season.id, userId: admin.id } },
      }),
    ).resolves.toMatchObject({ totalPoints: 3, exactCount: 1, matchesScored: 1 });
    await expect(prisma.standingSnapshot.count({ where: { seasonId: season.id } })).resolves.toBe(
      4,
    );
    await expect(
      prisma.auditLog.count({ where: { entityId: season.id, action: "SEASON_RECALCULATED" } }),
    ).resolves.toBe(1);
  });
});
