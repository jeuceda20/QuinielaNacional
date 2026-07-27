import { PrismaPg } from "@prisma/adapter-pg";
import argon2 from "argon2";
import { config } from "dotenv";

config({ path: ".env.pilot.local", quiet: true });

const { PrismaClient } = await import("../src/generated/prisma/client");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

try {
  const teams = await prisma.team.findMany({ where: { deletedAt: null }, orderBy: { displayOrder: "asc" } });
  if (teams.length < 10) throw new Error("Pilot requires ten seeded teams.");
  const adminPasswordHash = await argon2.hash("PilotoSeguro2026!", { type: argon2.argon2id });
  await prisma.user.upsert({
    where: { emailNormalized: "admin-piloto@example.invalid" },
    update: { role: "SUPER_ADMIN", status: "APPROVED", isTestUser: true, passwordHash: adminPasswordHash },
    create: { firstName: "Admin", lastName: "Piloto", nickname: "admin-piloto", nicknameNormalized: "admin-piloto", email: "admin-piloto@example.invalid", emailNormalized: "admin-piloto@example.invalid", passwordHash: adminPasswordHash, role: "SUPER_ADMIN", status: "APPROVED", approvedAt: new Date(), isTestUser: true, favoriteTeam: { connect: { id: teams[0]!.id } } },
  });
  const season = await prisma.season.upsert({
    where: { slug: "piloto-2026" },
    update: { status: "ACTIVE", archivedAt: null },
    create: { name: "Piloto ficticio 2026", slug: "piloto-2026", status: "ACTIVE" },
  });
  const users = await Promise.all(Array.from({ length: 50 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return prisma.user.upsert({
      where: { emailNormalized: `piloto-${number}@example.invalid` },
      update: { isTestUser: true, status: "APPROVED" },
      create: { firstName: "Piloto", lastName: number, nickname: `piloto-${number}`, nicknameNormalized: `piloto-${number}`, email: `piloto-${number}@example.invalid`, emailNormalized: `piloto-${number}@example.invalid`, passwordHash: "pilot-not-for-login", role: "USER", status: "APPROVED", approvedAt: new Date(), isTestUser: true, favoriteTeam: { connect: { id: teams[index % teams.length]!.id } } },
    });
  }));
  await prisma.seasonParticipant.createMany({ data: users.map((user) => ({ seasonId: season.id, userId: user.id, isTestData: true })), skipDuplicates: true });
  for (let roundNumber = 1; roundNumber <= 10; roundNumber++) {
    const round = await prisma.round.upsert({ where: { seasonId_slug: { seasonId: season.id, slug: `jornada-${roundNumber}` } }, update: {}, create: { seasonId: season.id, name: `Jornada ${roundNumber}`, slug: `jornada-${roundNumber}`, sequence: roundNumber, status: "DRAFT" } });
    for (let matchNumber = 0; matchNumber < 5; matchNumber++) {
      const home = teams[(roundNumber + matchNumber * 2) % teams.length]!;
      const away = teams[(roundNumber + matchNumber * 2 + 1) % teams.length]!;
      await prisma.match.upsert({ where: { id: `00000000-0000-4000-8000-${String(roundNumber * 10 + matchNumber).padStart(12, "0")}` }, update: {}, create: { id: `00000000-0000-4000-8000-${String(roundNumber * 10 + matchNumber).padStart(12, "0")}`, seasonId: season.id, roundId: round.id, homeTeamId: home.id, awayTeamId: away.id, scheduledAt: new Date(Date.UTC(2026, 7, roundNumber + matchNumber, 18)), predictionClosesAt: new Date(Date.UTC(2026, 7, roundNumber + matchNumber, 17, 55)), isDoublePoints: matchNumber === 0 } });
    }
  }
  console.log("Pilot created: 50 users, 1 season, 10 rounds, 50 matches.");
} finally { await prisma.$disconnect(); }
