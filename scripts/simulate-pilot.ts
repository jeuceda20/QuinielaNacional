import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
config({ path: ".env.pilot.local", quiet: true });
const { PrismaClient } = await import("../src/generated/prisma/client");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  const season = await prisma.season.findUniqueOrThrow({ where: { slug: "piloto-2026" } });
  const admin = await prisma.user.findUniqueOrThrow({ where: { emailNormalized: "admin-piloto@example.invalid" } });
  const lateUser = await prisma.user.upsert({ where: { emailNormalized: "tardio-piloto@example.invalid" }, update: { isTestUser: true, status: "APPROVED" }, create: { firstName: "Usuario", lastName: "Tardío", nickname: "tardio-piloto", nicknameNormalized: "tardio-piloto", email: "tardio-piloto@example.invalid", emailNormalized: "tardio-piloto@example.invalid", passwordHash: "pilot-not-for-login", role: "USER", status: "APPROVED", approvedAt: new Date(), isTestUser: true, favoriteTeam: { connect: { id: (await prisma.team.findFirstOrThrow()).id } } } });
  await prisma.seasonParticipant.upsert({ where: { seasonId_userId: { seasonId: season.id, userId: lateUser.id } }, update: {}, create: { seasonId: season.id, userId: lateUser.id, joinedAt: new Date() } });
  await prisma.seasonParticipant.upsert({ where: { seasonId_userId: { seasonId: season.id, userId: admin.id } }, update: { isEligible: true }, create: { seasonId: season.id, userId: admin.id, isTestData: true } });
  const users = await prisma.seasonParticipant.findMany({ where: { seasonId: season.id }, select: { userId: true } });
  const matches = await prisma.match.findMany({ where: { seasonId: season.id }, orderBy: { scheduledAt: "asc" } });
  for (const [index, match] of matches.entries()) {
    for (const user of users) await prisma.prediction.upsert({ where: { userId_matchId: { userId: user.userId, matchId: match.id } }, update: {}, create: { userId: user.userId, matchId: match.id, homeGoals: (index + user.userId.charCodeAt(0)) % 4, awayGoals: (index + user.userId.charCodeAt(1)) % 3, isTestData: true } });
    const homeGoals = index % 4, awayGoals = index % 3;
    await prisma.matchResult.upsert({ where: { matchId_version: { matchId: match.id, version: 1 } }, update: {}, create: { matchId: match.id, homeGoals, awayGoals, version: 1, recordedById: admin.id } });
    await prisma.match.update({ where: { id: match.id }, data: { status: "PROCESSED", officialHomeGoals: homeGoals, officialAwayGoals: awayGoals, processedAt: new Date(), processedById: admin.id } });
  }
  const [rescheduled, suspended, cancelled, corrected] = matches;
  if (rescheduled) await prisma.match.update({ where: { id: rescheduled.id }, data: { status: "RESCHEDULED", scheduledAt: new Date(rescheduled.scheduledAt.getTime() + 24 * 60 * 60 * 1000) } });
  if (suspended) await prisma.match.update({ where: { id: suspended.id }, data: { status: "SUSPENDED" } });
  if (cancelled) await prisma.match.update({ where: { id: cancelled.id }, data: { status: "CANCELLED" } });
  if (corrected) {
    await prisma.matchResult.updateMany({ where: { matchId: corrected.id }, data: { isCurrent: false } });
    await prisma.matchResult.upsert({ where: { matchId_version: { matchId: corrected.id, version: 2 } }, update: { isCurrent: true }, create: { matchId: corrected.id, homeGoals: 2, awayGoals: 2, version: 2, isCurrent: true, recordedById: admin.id, correctionReason: "Piloto: corrección de resultado" } });
  }
  const results = await prisma.matchResult.findMany({ where: { match: { seasonId: season.id }, isCurrent: true } });
  for (const result of results) {
    const match = matches.find((item) => item.id === result.matchId)!;
    const predictions = await prisma.prediction.findMany({ where: { matchId: match.id } });
    for (const prediction of predictions) {
      const exact = prediction.homeGoals === result.homeGoals && prediction.awayGoals === result.awayGoals;
      const outcome = Math.sign(prediction.homeGoals - prediction.awayGoals) === Math.sign(result.homeGoals - result.awayGoals);
      const basePoints = exact ? 3 : outcome ? 1 : 0;
      const multiplier = match.isDoublePoints ? 2 : 1;
      const scoreType = exact ? "EXACT" : outcome ? "PARTIAL" : "WRONG";
      await prisma.predictionScore.upsert({ where: { userId_matchId_resultVersion: { userId: prediction.userId, matchId: match.id, resultVersion: 1 } }, update: { scoreType, basePoints, multiplier, awardedPoints: basePoints * multiplier, matchResultId: result.id }, create: { seasonId: season.id, userId: prediction.userId, matchId: match.id, predictionId: prediction.id, matchResultId: result.id, scoreType, basePoints, multiplier, awardedPoints: basePoints * multiplier, resultVersion: 1, calculatedById: admin.id } });
    }
  }
  const standings = await prisma.$queryRaw<{ userId: string; nickname: string; points: bigint; position: bigint; exact: bigint; partial: bigint; wrong: bigint }[]>`SELECT u.id AS "userId", u.nickname, COALESCE(SUM(ps."awardedPoints"),0)::bigint AS points, RANK() OVER (ORDER BY COALESCE(SUM(ps."awardedPoints"),0) DESC)::bigint AS position, COUNT(*) FILTER (WHERE ps."scoreType"='EXACT')::bigint AS exact, COUNT(*) FILTER (WHERE ps."scoreType"='PARTIAL')::bigint AS partial, COUNT(*) FILTER (WHERE ps."scoreType"='WRONG')::bigint AS wrong FROM "SeasonParticipant" sp JOIN "User" u ON u.id=sp."userId" LEFT JOIN "PredictionScore" ps ON ps."userId"=u.id AND ps."seasonId"=sp."seasonId" WHERE sp."seasonId"=${season.id} GROUP BY u.id, u.nickname`;
  for (const row of standings) await prisma.standing.upsert({ where: { seasonId_userId: { seasonId: season.id, userId: row.userId } }, update: { position: Number(row.position), totalPoints: Number(row.points), exactCount: Number(row.exact), partialCount: Number(row.partial), wrongCount: Number(row.wrong), matchesScored: 50, recalculatedAt: new Date() }, create: { seasonId: season.id, userId: row.userId, position: Number(row.position), totalPoints: Number(row.points), exactCount: Number(row.exact), partialCount: Number(row.partial), wrongCount: Number(row.wrong), matchesScored: 50 } });
  const adminStanding = standings.find((row) => row.nickname === "admin-piloto");
  console.log(`Admin piloto: posición ${adminStanding?.position ?? 0}, puntos ${adminStanding?.points ?? 0}`);
} finally { await prisma.$disconnect(); }
