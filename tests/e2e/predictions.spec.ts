import { PrismaPg } from "@prisma/adapter-pg";
import { expect, test } from "@playwright/test";
import argon2 from "argon2";

import { PrismaClient } from "@/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith("_test")) {
  throw new Error("E2E tests require an isolated DATABASE_URL ending in _test.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const suffix = `e2e-${Date.now()}`;
const email = `${suffix}@example.invalid`;
const password = "correct-horse-battery";
const adminEmail = `admin-${suffix}@example.invalid`;
let userId = "";
let adminId = "";
let matchId = "";
let rescheduleMatchId = "";
let seasonId = "";
let roundId = "";
let teamIds: string[] = [];

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  const [home, away] = await Promise.all(
    ["Local", "Visitante"].map((name, index) =>
      prisma.team.create({
        data: {
          name: `${name} ${suffix}`,
          shortName: name.slice(0, 3),
          slug: `${name}-${suffix}`,
          displayOrder: 900 + index,
        },
      }),
    ),
  );
  if (!home || !away) throw new Error("Unable to create E2E teams.");
  teamIds = [home.id, away.id];
  const user = await prisma.user.create({
    data: {
      firstName: "E2E",
      lastName: "Participant",
      nickname: suffix,
      nicknameNormalized: suffix,
      email,
      emailNormalized: email,
      passwordHash: await argon2.hash(password),
      status: "APPROVED",
      emailVerifiedAt: new Date(),
      approvedAt: new Date(),
      favoriteTeamId: home.id,
      isTestUser: true,
    },
  });
  userId = user.id;
  const admin = await prisma.user.create({
    data: {
      firstName: "E2E",
      lastName: "Admin",
      nickname: `admin-${suffix}`,
      nicknameNormalized: `admin-${suffix}`,
      email: adminEmail,
      emailNormalized: adminEmail,
      passwordHash: await argon2.hash(password),
      role: "ADMIN",
      status: "APPROVED",
      emailVerifiedAt: new Date(),
      approvedAt: new Date(),
      favoriteTeamId: home.id,
      isTestUser: true,
    },
  });
  adminId = admin.id;
  const season = await prisma.season.create({
    data: { name: suffix, slug: suffix, status: "DRAFT", startsAt: new Date() },
  });
  seasonId = season.id;
  await prisma.seasonParticipant.create({ data: { seasonId, userId, isTestData: true } });
  const round = await prisma.round.create({
    data: {
      seasonId,
      name: suffix,
      slug: suffix,
      status: "PUBLISHED",
      sequence: 1,
      publishedAt: new Date(),
    },
  });
  roundId = round.id;
  const scheduledAt = new Date(Date.now() + 86_400_000);
  const match = await prisma.match.create({
    data: {
      seasonId,
      roundId,
      homeTeamId: home.id,
      awayTeamId: away.id,
      scheduledAt,
      predictionClosesAt: new Date(scheduledAt.getTime() - 300_000),
    },
  });
  matchId = match.id;
  const rescheduleMatch = await prisma.match.create({
    data: {
      seasonId,
      roundId,
      homeTeamId: home.id,
      awayTeamId: away.id,
      scheduledAt: new Date(Date.now() + 172_800_000),
      predictionClosesAt: new Date(Date.now() + 172_500_000),
    },
  });
  rescheduleMatchId = rescheduleMatch.id;
});

test.beforeEach(async () => {
  await prisma.rateLimitBucket.deleteMany();
});

test.afterAll(async () => {
  if (!matchId || !seasonId || !userId || !adminId) {
    await prisma.$disconnect();
    return;
  }
  await prisma.predictionScore.deleteMany({ where: { matchId } });
  await prisma.matchResult.deleteMany({ where: { matchId } });
  await prisma.standingSnapshot.deleteMany({ where: { triggerMatchId: matchId } });
  await prisma.standing.deleteMany({ where: { seasonId } });
  await prisma.auditLog.deleteMany({
    where: { entityId: { in: [matchId, seasonId, userId, adminId] } },
  });
  await prisma.matchScheduleHistory.deleteMany({
    where: { OR: [{ matchId: rescheduleMatchId }, { changedById: adminId }] },
  });
  await prisma.prediction.deleteMany({ where: { matchId } });
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.session.deleteMany({ where: { userId: adminId } });
  await prisma.match.deleteMany({ where: { id: matchId } });
  await prisma.match.deleteMany({ where: { id: rescheduleMatchId } });
  await prisma.seasonParticipant.deleteMany({ where: { seasonId } });
  await prisma.round.deleteMany({ where: { id: roundId } });
  await prisma.season.deleteMany({ where: { id: seasonId } });
  await prisma.user.deleteMany({ where: { id: userId } });
  await prisma.user.deleteMany({ where: { id: adminId } });
  await prisma.team.deleteMany({ where: { id: { in: teamIds } } });
  await prisma.$disconnect();
});

test("an approved participant logs in and saves a prediction", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator("form button").click();
  await expect
    .poll(async () => (await page.context().cookies()).some((cookie) => cookie.name === "session"))
    .toBe(true);

  await page.goto("/predictions");
  const predictionForm = page
    .locator("form")
    .filter({ has: page.locator('input[name="homeGoals"]') })
    .first();
  await expect(predictionForm).toBeVisible();
  await predictionForm.locator('input[name="homeGoals"]').fill("2");
  await predictionForm.locator('input[name="awayGoals"]').fill("1");
  await predictionForm.locator("button").click();
  await expect(page.getByRole("status")).toHaveText(/Pron.stico guardado/);
  await expect(
    prisma.prediction.findUnique({ where: { userId_matchId: { userId, matchId } } }),
  ).resolves.toMatchObject({ homeGoals: 2, awayGoals: 1 });
});

test("an administrator processes the finished match through the UI", async ({ page }) => {
  await prisma.match.update({ where: { id: matchId }, data: { status: "FINISHED_PENDING" } });
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(adminEmail);
  await page.locator('input[name="password"]').fill(password);
  await page.locator("form button").click();
  await expect
    .poll(async () => (await page.context().cookies()).some((cookie) => cookie.name === "session"))
    .toBe(true);
  await page.goto("/admin/matches");
  await page.locator('input[name="homeGoals"]').fill("2");
  await page.locator('input[name="awayGoals"]').fill("1");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /Procesar resultado/ }).click();
  await expect
    .poll(async () => (await prisma.match.findUnique({ where: { id: matchId } }))?.status)
    .toBe("PROCESSED");
});

test("an administrator reschedules a scheduled match through the UI", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(adminEmail);
  await page.locator('input[name="password"]').fill(password);
  await page.locator("form button").click();
  await expect
    .poll(async () => (await page.context().cookies()).some((cookie) => cookie.name === "session"))
    .toBe(true);
  await page.goto("/admin/matches");
  const details = page.locator("details").filter({ hasText: "Estado deportivo: SCHEDULED" });
  await details.locator("summary").click();
  await details.locator('input[name="reason"]').fill("Cancha no disponible");
  await details.locator('input[name="scheduledAt"]').fill("2030-01-02T18:00");
  await details.getByRole("button", { name: "Reprogramar" }).click();
  await expect
    .poll(async () => (await prisma.match.findUnique({ where: { id: rescheduleMatchId } }))?.status)
    .toBe("RESCHEDULED");
});
