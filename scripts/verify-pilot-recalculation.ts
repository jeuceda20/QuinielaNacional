import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
config({ path: ".env.pilot.local", quiet: true });
const { PrismaClient } = await import("../src/generated/prisma/client");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  const season = await prisma.season.findUniqueOrThrow({ where: { slug: "piloto-2026" } });
  const expected = await prisma.$queryRaw<{ userId: string; points: bigint }[]>`SELECT sp."userId", COALESCE(SUM(ps."awardedPoints"),0)::bigint AS points FROM "SeasonParticipant" sp LEFT JOIN "PredictionScore" ps ON ps."userId"=sp."userId" AND ps."seasonId"=sp."seasonId" WHERE sp."seasonId"=${season.id} GROUP BY sp."userId"`;
  const actual = await prisma.standing.findMany({ where: { seasonId: season.id }, select: { userId: true, totalPoints: true } });
  const differences = expected.filter((row) => actual.find((standing) => standing.userId === row.userId)?.totalPoints !== Number(row.points));
  console.log(`Diferencias = ${differences.length}`);
  if (differences.length) process.exitCode = 1;
} finally { await prisma.$disconnect(); }
