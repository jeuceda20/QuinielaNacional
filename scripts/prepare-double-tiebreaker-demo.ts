import { PrismaPg } from "@prisma/adapter-pg";
import argon2 from "argon2";
import { config } from "dotenv";

config({ path: ".env.pilot.local", quiet: true });

const { PrismaClient } = await import("../src/generated/prisma/client");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

type ResultMatch = Readonly<{
  id: string;
  isDoublePoints: boolean;
  result: { homeGoals: number; awayGoals: number };
}>;

function partial(result: ResultMatch["result"]) {
  if (result.homeGoals > result.awayGoals) return { homeGoals: result.homeGoals + 1, awayGoals: result.awayGoals };
  if (result.homeGoals < result.awayGoals) return { homeGoals: result.homeGoals, awayGoals: result.awayGoals + 1 };
  return { homeGoals: result.homeGoals + 1, awayGoals: result.awayGoals + 1 };
}

function wrong(result: ResultMatch["result"]) {
  if (result.homeGoals > result.awayGoals) return { homeGoals: 0, awayGoals: result.homeGoals + result.awayGoals + 1 };
  if (result.homeGoals < result.awayGoals) return { homeGoals: result.homeGoals + result.awayGoals + 1, awayGoals: 0 };
  return { homeGoals: result.homeGoals + 1, awayGoals: result.awayGoals };
}

try {
  const season = await prisma.season.findUniqueOrThrow({ where: { slug: "piloto-2026" } });
  const admin = await prisma.user.findUniqueOrThrow({ where: { emailNormalized: "admin-piloto@example.invalid" } });
  const team = await prisma.team.findFirstOrThrow({ where: { deletedAt: null } });
  const passwordHash = await argon2.hash("PilotoSeguro2026!", { type: argon2.argon2id });
  const demoUsers = await Promise.all(
    ["empate-normal", "empate-jornada"].map((nickname) =>
      prisma.user.upsert({
        where: { emailNormalized: `${nickname}@example.invalid` },
        update: { status: "APPROVED", isTestUser: true, passwordHash },
        create: {
          firstName: "Demo",
          lastName: nickname === "empate-normal" ? "Normal" : "Jornada",
          nickname,
          nicknameNormalized: nickname,
          email: `${nickname}@example.invalid`,
          emailNormalized: `${nickname}@example.invalid`,
          passwordHash,
          role: "USER",
          status: "APPROVED",
          approvedAt: new Date(),
          isTestUser: true,
          favoriteTeamId: team.id,
        },
      }),
    ),
  );
  const leader = await prisma.user.upsert({
    where: { emailNormalized: "piloto-46@example.invalid" },
    update: { status: "APPROVED", isTestUser: true, passwordHash },
    create: {
      firstName: "Piloto",
      lastName: "46",
      nickname: "piloto-46",
      nicknameNormalized: "piloto-46",
      email: "piloto-46@example.invalid",
      emailNormalized: "piloto-46@example.invalid",
      passwordHash,
      role: "USER",
      status: "APPROVED",
      approvedAt: new Date(),
      isTestUser: true,
      favoriteTeamId: team.id,
    },
  });
  await prisma.seasonParticipant.createMany({
    data: [...demoUsers, leader].map((user) => ({ seasonId: season.id, userId: user.id, isTestData: true })),
    skipDuplicates: true,
  });
  await prisma.match.updateMany({
    where: { seasonId: season.id, archivedAt: null },
    data: { status: "PROCESSED" },
  });
  await prisma.predictionScore.deleteMany({ where: { seasonId: season.id } });

  const matches = await prisma.match.findMany({
    where: {
      seasonId: season.id,
      status: "PROCESSED",
      archivedAt: null,
      results: { some: { isCurrent: true } },
    },
    orderBy: { scheduledAt: "asc" },
    take: 50,
    select: {
      id: true,
      isDoublePoints: true,
      results: { where: { isCurrent: true }, select: { id: true, version: true, homeGoals: true, awayGoals: true } },
    },
  });
  const scoredMatches = matches.flatMap((match) => {
    const result = match.results[0];
    return result ? [{ id: match.id, isDoublePoints: match.isDoublePoints, result }] : [];
  });
  const normalMatches = scoredMatches.filter((match) => !match.isDoublePoints);
  const doubleMatches = scoredMatches.filter((match) => match.isDoublePoints);
  if (normalMatches.length !== 40 || doubleMatches.length !== 10) {
    throw new Error("El piloto debe tener 40 partidos normales y 10 partidos de jornada procesados.");
  }

  const [normalUser, jornadaUser] = demoUsers;
  for (const match of scoredMatches) {
    const exact = { homeGoals: match.result.homeGoals, awayGoals: match.result.awayGoals };
    const normalPrediction =
      !match.isDoublePoints && normalMatches.indexOf(match) < 12
        ? exact
        : !match.isDoublePoints && normalMatches.indexOf(match) < 27
          ? partial(match.result)
          : wrong(match.result);
    const jornadaPrediction =
      (match.isDoublePoints && doubleMatches.indexOf(match) < 5) ||
      (!match.isDoublePoints && normalMatches.indexOf(match) < 7)
        ? exact
        : wrong(match.result);
    const [normalSaved, jornadaSaved, leaderSaved] = await Promise.all([
      prisma.prediction.upsert({
        where: { userId_matchId: { userId: normalUser!.id, matchId: match.id } },
        update: { ...normalPrediction, isTestData: true },
        create: { userId: normalUser!.id, matchId: match.id, ...normalPrediction, isTestData: true },
      }),
      prisma.prediction.upsert({
        where: { userId_matchId: { userId: jornadaUser!.id, matchId: match.id } },
        update: { ...jornadaPrediction, isTestData: true },
        create: { userId: jornadaUser!.id, matchId: match.id, ...jornadaPrediction, isTestData: true },
      }),
      prisma.prediction.upsert({
        where: { userId_matchId: { userId: leader.id, matchId: match.id } },
        update: { ...exact, isTestData: true },
        create: { userId: leader.id, matchId: match.id, ...exact, isTestData: true },
      }),
    ]);
    const score = (prediction: { homeGoals: number; awayGoals: number }) => {
      const exact = prediction.homeGoals === match.result.homeGoals && prediction.awayGoals === match.result.awayGoals;
      const sameOutcome = Math.sign(prediction.homeGoals - prediction.awayGoals) === Math.sign(match.result.homeGoals - match.result.awayGoals);
      const basePoints = exact ? 3 : sameOutcome ? 1 : 0;
      return { scoreType: exact ? "EXACT" : sameOutcome ? "PARTIAL" : "WRONG", basePoints, awardedPoints: basePoints * (match.isDoublePoints ? 2 : 1) } as const;
    };
    await Promise.all([
      prisma.predictionScore.upsert({
        where: { userId_matchId_resultVersion: { userId: normalUser!.id, matchId: match.id, resultVersion: match.result.version } },
        update: { predictionId: normalSaved.id, matchResultId: match.result.id, multiplier: match.isDoublePoints ? 2 : 1, ...score(normalSaved) },
        create: { seasonId: season.id, userId: normalUser!.id, matchId: match.id, predictionId: normalSaved.id, matchResultId: match.result.id, resultVersion: match.result.version, calculatedById: admin.id, multiplier: match.isDoublePoints ? 2 : 1, ...score(normalSaved) },
      }),
      prisma.predictionScore.upsert({
        where: { userId_matchId_resultVersion: { userId: jornadaUser!.id, matchId: match.id, resultVersion: match.result.version } },
        update: { predictionId: jornadaSaved.id, matchResultId: match.result.id, multiplier: match.isDoublePoints ? 2 : 1, ...score(jornadaSaved) },
        create: { seasonId: season.id, userId: jornadaUser!.id, matchId: match.id, predictionId: jornadaSaved.id, matchResultId: match.result.id, resultVersion: match.result.version, calculatedById: admin.id, multiplier: match.isDoublePoints ? 2 : 1, ...score(jornadaSaved) },
      }),
      prisma.predictionScore.upsert({
        where: { userId_matchId_resultVersion: { userId: leader.id, matchId: match.id, resultVersion: match.result.version } },
        update: { predictionId: leaderSaved.id, matchResultId: match.result.id, scoreType: "EXACT", basePoints: 3, multiplier: match.isDoublePoints ? 2 : 1, awardedPoints: match.isDoublePoints ? 6 : 3 },
        create: { seasonId: season.id, userId: leader.id, matchId: match.id, predictionId: leaderSaved.id, matchResultId: match.result.id, resultVersion: match.result.version, calculatedById: admin.id, scoreType: "EXACT", basePoints: 3, multiplier: match.isDoublePoints ? 2 : 1, awardedPoints: match.isDoublePoints ? 6 : 3 },
      }),
    ]);
  }

  const [participants, scores, allMatches, previous] = await Promise.all([
    prisma.seasonParticipant.findMany({ where: { seasonId: season.id, isEligible: true, excludedAt: null }, select: { userId: true, user: { select: { nickname: true } } } }),
    prisma.predictionScore.findMany({ where: { seasonId: season.id }, select: { userId: true, matchId: true, scoreType: true, awardedPoints: true } }),
    prisma.match.findMany({ where: { seasonId: season.id }, select: { id: true, isDoublePoints: true } }),
    prisma.standing.findMany({ where: { seasonId: season.id }, select: { userId: true, previousPosition: true } }),
  ]);
  const doubleIds = new Set(allMatches.filter((match) => match.isDoublePoints).map((match) => match.id));
  const totals = new Map(participants.map((participant) => [participant.userId, { totalPoints: 0, doublePoints: 0, exactCount: 0, doubleExactCount: 0, partialCount: 0, wrongCount: 0, noPredictionCount: 0, matchesScored: 0 }]));
  for (const score of scores) {
    const total = totals.get(score.userId);
    if (!total) continue;
    total.totalPoints += score.awardedPoints;
    total.matchesScored++;
    if (score.scoreType === "EXACT") total.exactCount++;
    if (score.scoreType === "PARTIAL") total.partialCount++;
    if (score.scoreType === "WRONG") total.wrongCount++;
    if (score.scoreType === "NO_PREDICTION") total.noPredictionCount++;
    if (doubleIds.has(score.matchId)) {
      total.doublePoints += score.awardedPoints;
      if (score.scoreType === "EXACT") total.doubleExactCount++;
    }
  }
  const ordered = participants
    .map((participant) => ({ ...participant, ...totals.get(participant.userId)! }))
    .sort((left, right) => right.totalPoints - left.totalPoints || right.exactCount - left.exactCount || right.doubleExactCount - left.doubleExactCount || left.user.nickname.localeCompare(right.user.nickname));
  let last: (typeof ordered)[number] | undefined;
  let currentPosition = 0;
  for (const [index, standing] of ordered.entries()) {
    if (!last || standing.totalPoints !== last.totalPoints || standing.exactCount !== last.exactCount || standing.doubleExactCount !== last.doubleExactCount) {
      currentPosition = index + 1;
    }
    await prisma.standing.upsert({
      where: { seasonId_userId: { seasonId: season.id, userId: standing.userId } },
      update: { position: currentPosition, previousPosition: standing.userId === leader.id ? null : previous.find((item) => item.userId === standing.userId)?.previousPosition ?? null, ...totals.get(standing.userId)!, recalculatedAt: new Date() },
      create: { seasonId: season.id, userId: standing.userId, position: currentPosition, ...totals.get(standing.userId)! },
    });
    last = standing;
  }
  const standings = await prisma.standing.findMany({
    where: { seasonId: season.id, userId: { in: [...demoUsers, leader].map((user) => user.id) } },
    select: {
      position: true,
      totalPoints: true,
      exactCount: true,
      doublePoints: true,
      doubleExactCount: true,
      user: { select: { nickname: true } },
    },
    orderBy: { position: "asc" },
  });
  for (const standing of standings) {
    console.log(`${standing.position}. ${standing.user.nickname}: ${standing.totalPoints} puntos, ${standing.exactCount} exactos, ${standing.doublePoints} puntos de jornada, ${standing.doubleExactCount} exactos de jornada`);
  }
} finally {
  await prisma.$disconnect();
}
