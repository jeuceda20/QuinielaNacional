import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it, vi } from "vitest";

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

afterAll(() => prisma.$disconnect());

describe.each([50, 100, 500])("result processing with %i participants", (participantCount) => {
  it("creates scores and standings for every participant", async () => {
    const suffix = randomUUID().slice(0, 8);
    const now = new Date("2026-08-20T12:00:00.000Z");
    const admin = await prisma.user.create({
      data: {
        firstName: "Volume",
        lastName: "Admin",
        nickname: `admin-${suffix}`,
        nicknameNormalized: `admin-${suffix}`,
        email: `admin-${suffix}@example.invalid`,
        emailNormalized: `admin-${suffix}@example.invalid`,
        passwordHash: "hash",
        role: "SUPER_ADMIN",
        status: "APPROVED",
      },
    });
    const [home, away] = await Promise.all([
      prisma.team.create({
        data: { name: `Home ${suffix}`, shortName: "H", slug: `home-${suffix}`, displayOrder: 900 },
      }),
      prisma.team.create({
        data: { name: `Away ${suffix}`, shortName: "A", slug: `away-${suffix}`, displayOrder: 901 },
      }),
    ]);
    const season = await prisma.season.create({
      data: { name: `Volume ${suffix}`, slug: `volume-${suffix}` },
    });
    const round = await prisma.round.create({
      data: { seasonId: season.id, name: "Volume", slug: `round-${suffix}` },
    });
    const match = await prisma.match.create({
      data: {
        seasonId: season.id,
        roundId: round.id,
        homeTeamId: home.id,
        awayTeamId: away.id,
        scheduledAt: now,
        predictionClosesAt: now,
        status: "FINISHED_PENDING",
      },
    });
    const users = await prisma.user.createManyAndReturn({
      data: Array.from({ length: participantCount }, (_, index) => ({
        firstName: "Volume",
        lastName: "Participant",
        nickname: `participant-${suffix}-${index}`,
        nicknameNormalized: `participant-${suffix}-${index}`,
        email: `participant-${suffix}-${index}@example.invalid`,
        emailNormalized: `participant-${suffix}-${index}@example.invalid`,
        passwordHash: "hash",
        status: "APPROVED" as const,
      })),
      select: { id: true },
    });
    const userIds = [admin.id, ...users.map((user) => user.id)];
    try {
      await prisma.seasonParticipant.createMany({
        data: userIds.map((userId) => ({ seasonId: season.id, userId })),
      });
      await new ProcessMatchResultService(new PrismaProcessMatchResultRepository(prisma)).execute(
        createRequestContext({
          userId: admin.id,
          role: "SUPER_ADMIN",
          requestId: `volume-${suffix}`,
        }),
        { matchId: match.id, homeGoals: 2, awayGoals: 1 },
        now,
      );
      await expect(prisma.predictionScore.count({ where: { matchId: match.id } })).resolves.toBe(
        participantCount + 1,
      );
      await expect(prisma.standing.count({ where: { seasonId: season.id } })).resolves.toBe(
        participantCount + 1,
      );
      await prisma.standing.update({
        where: { seasonId_userId: { seasonId: season.id, userId: admin.id } },
        data: { totalPoints: 999 },
      });
      await expect(
        new RecalculateSeasonService(new PrismaSeasonRecalculationRepository(prisma)).execute(
          createRequestContext({
            userId: admin.id,
            role: "SUPER_ADMIN",
            requestId: `recalculate-${suffix}`,
          }),
          season.id,
          new Date(now.getTime() + 1),
        ),
      ).resolves.toEqual({
        matches: 1,
        scores: participantCount + 1,
        standings: participantCount + 1,
      });
      await expect(
        prisma.standing.findUnique({
          where: { seasonId_userId: { seasonId: season.id, userId: admin.id } },
        }),
      ).resolves.toMatchObject({ totalPoints: 0 });
    } finally {
      await prisma.predictionScore.deleteMany({ where: { matchId: match.id } });
      await prisma.standingSnapshot.deleteMany({ where: { seasonId: season.id } });
      await prisma.standing.deleteMany({ where: { seasonId: season.id } });
      await prisma.matchResult.deleteMany({ where: { matchId: match.id } });
      await prisma.auditLog.deleteMany({ where: { entityId: { in: [match.id, season.id] } } });
      await prisma.match.deleteMany({ where: { id: match.id } });
      await prisma.seasonParticipant.deleteMany({ where: { seasonId: season.id } });
      await prisma.round.deleteMany({ where: { id: round.id } });
      await prisma.season.deleteMany({ where: { id: season.id } });
      await prisma.team.deleteMany({ where: { id: { in: [home.id, away.id] } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
  });
});
