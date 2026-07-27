import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.pilot.local", quiet: true });

const { PrismaClient } = await import("../src/generated/prisma/client");
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const emails = [
  "test3@gmail.com",
  "jeuceda20082@gmail.com",
  "test@test.com",
  "agile@agile.com",
  "jeuceda2008@gmail.com",
];

try {
  const season = await prisma.season.findFirstOrThrow({ where: { name: "TEST1" } });
  const users = await prisma.user.findMany({
    where: { emailNormalized: { in: emails } },
    select: { id: true, nickname: true },
  });
  const operator = users.find((user) => user.nickname === "jdaniel");
  if (!operator || users.length !== 5) throw new Error("Faltan usuarios de la simulación.");

  const oldMatches = await prisma.match.findMany({ where: { seasonId: season.id }, select: { id: true } });
  const matchIds = oldMatches.map((match) => match.id);
  if (matchIds.length) {
    await prisma.predictionScore.deleteMany({ where: { matchId: { in: matchIds } } });
    await prisma.prediction.deleteMany({ where: { matchId: { in: matchIds } } });
    await prisma.matchResult.deleteMany({ where: { matchId: { in: matchIds } } });
    await prisma.matchScheduleHistory.deleteMany({ where: { matchId: { in: matchIds } } });
    await prisma.standingSnapshot.deleteMany({ where: { triggerMatchId: { in: matchIds } } });
    await prisma.match.deleteMany({ where: { id: { in: matchIds } } });
  }
  await prisma.standing.deleteMany({ where: { seasonId: season.id } });
  await prisma.round.deleteMany({ where: { seasonId: season.id } });

  const teams = await prisma.team.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { displayOrder: "asc" },
    select: { id: true },
  });
  if (teams.length !== 12) throw new Error("La simulación requiere 12 equipos activos.");

  const now = new Date();
  let ring = teams.map((team) => team.id);
  for (let roundIndex = 0; roundIndex < 5; roundIndex++) {
    const round = await prisma.round.create({
      data: {
        seasonId: season.id,
        name: `Jornada ${roundIndex + 1}`,
        slug: `jornada-${roundIndex + 1}-test1`,
        sequence: roundIndex + 1,
        status: "PUBLISHED",
      },
    });
    for (let matchIndex = 0; matchIndex < 6; matchIndex++) {
      const scheduledAt = new Date(now.getTime() - (5 - roundIndex) * 86_400_000 - matchIndex * 7_200_000);
      const homeGoals = (roundIndex + matchIndex) % 4;
      const awayGoals = (roundIndex * 2 + matchIndex + 1) % 3;
      const match = await prisma.match.create({
        data: {
          seasonId: season.id, roundId: round.id, homeTeamId: ring[matchIndex]!, awayTeamId: ring[11 - matchIndex]!,
          scheduledAt, predictionClosesAt: new Date(scheduledAt.getTime() - 300_000),
          status: "PROCESSED", isDoublePoints: matchIndex === 0, officialHomeGoals: homeGoals,
          officialAwayGoals: awayGoals, processedAt: now, processedById: operator.id, resultVersion: 1,
        },
      });
      const result = await prisma.matchResult.create({
        data: { homeGoals, awayGoals, version: 1, isCurrent: true, match: { connect: { id: match.id } }, recordedBy: { connect: { id: operator.id } } },
      });
      for (const [userIndex, user] of users.entries()) {
        const predictedHome = (roundIndex + matchIndex + userIndex) % 4;
        const predictedAway = (roundIndex * 2 + matchIndex + userIndex + 1) % 3;
        const prediction = await prisma.prediction.create({
          data: { homeGoals: predictedHome, awayGoals: predictedAway, submittedAt: new Date(scheduledAt.getTime() - 600_000), isTestData: true, user: { connect: { id: user.id } }, match: { connect: { id: match.id } } },
        });
        const exact = predictedHome === homeGoals && predictedAway === awayGoals;
        const partial = !exact && Math.sign(predictedHome - predictedAway) === Math.sign(homeGoals - awayGoals);
        const basePoints = exact ? 3 : partial ? 1 : 0;
        const multiplier = matchIndex === 0 ? 2 : 1;
        await prisma.predictionScore.create({
          data: {
            scoreType: exact ? "EXACT" : partial ? "PARTIAL" : "WRONG", basePoints, multiplier,
            awardedPoints: basePoints * multiplier, resultVersion: 1,
            season: { connect: { id: season.id } }, user: { connect: { id: user.id } }, match: { connect: { id: match.id } },
            prediction: { connect: { id: prediction.id } }, matchResult: { connect: { id: result.id } },
            calculatedBy: { connect: { id: operator.id } },
          },
        });
      }
    }
    ring = [ring[0]!, ring[11]!, ...ring.slice(1, 11)];
  }

  const rows = [];
  for (const user of users) {
    const scores = await prisma.predictionScore.findMany({ where: { seasonId: season.id, userId: user.id } });
    const totalPoints = scores.reduce((total, score) => total + score.awardedPoints, 0);
    const exactCount = scores.filter((score) => score.scoreType === "EXACT").length;
    const partialCount = scores.filter((score) => score.scoreType === "PARTIAL").length;
    const doublePoints = scores.filter((score) => score.multiplier === 2).reduce((total, score) => total + score.awardedPoints - score.basePoints, 0);
    const doubleExactCount = scores.filter((score) => score.multiplier === 2 && score.scoreType === "EXACT").length;
    rows.push({ user, totalPoints, exactCount, partialCount, doublePoints, doubleExactCount, matchCount: scores.length });
  }
  rows.sort((a, b) => b.totalPoints - a.totalPoints || b.exactCount - a.exactCount || b.doubleExactCount - a.doubleExactCount || a.user.nickname.localeCompare(b.user.nickname));
  for (const [index, row] of rows.entries()) {
    await prisma.standing.create({
      data: { seasonId: season.id, userId: row.user.id, position: index + 1, totalPoints: row.totalPoints, doublePoints: row.doublePoints, exactCount: row.exactCount, doubleExactCount: row.doubleExactCount, partialCount: row.partialCount, wrongCount: row.matchCount - row.exactCount - row.partialCount, matchesScored: row.matchCount, recalculatedAt: now },
    });
  }
  console.log(JSON.stringify({ rounds: 5, matches: 30, standings: rows.map((row, index) => ({ position: index + 1, nickname: row.user.nickname, points: row.totalPoints, exact: row.exactCount, partial: row.partialCount, doublePoints: row.doublePoints })) }, null, 2));
} finally {
  await prisma.$disconnect();
}
