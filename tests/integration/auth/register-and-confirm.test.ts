import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

import { ConfirmEmail } from "@/modules/auth/application/confirm-email";
import { RegisterUser } from "@/modules/auth/application/register-user";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaEmailConfirmationRepository } from "@/modules/auth/infrastructure/prisma-email-confirmation-repository";
import { PrismaEmailVerificationTokenRepository } from "@/modules/auth/infrastructure/prisma-email-verification-token-repository";
import { FakeEmailProvider } from "@/modules/email/infrastructure/fake-email-provider";
import { PrismaTeamRepository } from "@/modules/sports/infrastructure/prisma-sports-repositories";
import { ApproveUser } from "@/modules/users/application/approve-user";
import { PrismaUserApprovalRepository } from "@/modules/users/infrastructure/prisma-user-approval-repository";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";

import { getTestDatabaseUrl } from "../../helpers/test-database";

import { PrismaClient } from "@/generated/prisma/client";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: getTestDatabaseUrl() }),
});
const createdUserIds: string[] = [];
const createdTeamIds: string[] = [];

afterEach(async () => {
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds.splice(0) } } });
  await prisma.team.deleteMany({ where: { id: { in: createdTeamIds.splice(0) } } });
});

afterAll(() => prisma.$disconnect());

describe("registration and email confirmation", () => {
  it("persists a pending account and confirms its one-time email token", async () => {
    const suffix = randomUUID();
    const team = await prisma.team.create({
      data: {
        name: `Integration Team ${suffix}`,
        shortName: "INT",
        slug: `integration-team-${suffix}`,
        displayOrder: 999,
      },
    });
    createdTeamIds.push(team.id);
    const emails = new FakeEmailProvider("test");
    const registration = new RegisterUser(
      new PrismaUserRepository(prisma),
      new PrismaTeamRepository(prisma),
      new Argon2PasswordHasher(),
      new PrismaEmailVerificationTokenRepository(prisma),
      emails,
      "https://app.example.invalid",
    );
    const result = await registration.execute(
      {
        firstName: "Integration",
        lastName: "User",
        nickname: `user-${suffix}`,
        email: `user-${suffix}@example.invalid`,
        password: "correct-horse-battery",
        passwordConfirmation: "correct-horse-battery",
        favoriteTeamId: team.id,
        acceptedRules: true,
      },
      new Date("2026-08-15T00:00:00.000Z"),
    );
    createdUserIds.push(result.userId);

    expect(result.emailSent).toBe(true);
    const verificationUrl = emails.sentEmails[0]?.content;
    const token = verificationUrl && new URL(verificationUrl).searchParams.get("token");
    expect(token).toBeTruthy();

    await expect(
      new ConfirmEmail(new PrismaEmailConfirmationRepository(prisma)).execute(
        token as string,
        new Date("2026-08-15T00:01:00.000Z"),
      ),
    ).resolves.toBe("CONFIRMED");
    await expect(
      new ConfirmEmail(new PrismaEmailConfirmationRepository(prisma)).execute(
        token as string,
        new Date("2026-08-15T00:02:00.000Z"),
      ),
    ).resolves.toBe("ALREADY_CONFIRMED");
    await expect(prisma.user.findUnique({ where: { id: result.userId } })).resolves.toMatchObject({
      status: "PENDING_APPROVAL",
      emailVerifiedAt: expect.any(Date),
    });

    const administrator = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "Integration",
        nickname: `admin-${suffix}`,
        nicknameNormalized: `admin-${suffix}`,
        email: `admin-${suffix}@example.invalid`,
        emailNormalized: `admin-${suffix}@example.invalid`,
        passwordHash: "hash",
        role: "ADMIN",
        status: "APPROVED",
      },
    });
    createdUserIds.push(administrator.id);
    const approvalEmails = new FakeEmailProvider("test");

    await expect(
      new ApproveUser(
        new PrismaUserRepository(prisma),
        new PrismaUserApprovalRepository(prisma),
        approvalEmails,
      ).execute(
        {
          actor: { id: administrator.id, role: "ADMIN", status: "APPROVED" },
          userId: result.userId,
          addToActiveSeason: false,
          requestId: "integration-request",
        },
        new Date("2026-08-15T00:03:00.000Z"),
      ),
    ).resolves.toEqual({ alreadyApproved: false });
    await expect(prisma.user.findUnique({ where: { id: result.userId } })).resolves.toMatchObject({
      status: "APPROVED",
      approvedById: administrator.id,
    });
    expect(approvalEmails.sentEmails).toHaveLength(1);
    await expect(prisma.auditLog.findMany({ where: { entityId: result.userId } })).resolves.toEqual(
      [expect.objectContaining({ action: "USER_APPROVED", requestId: "integration-request" })],
    );
  });
});
