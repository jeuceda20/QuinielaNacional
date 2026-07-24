import { describe, expect, it, vi } from "vitest";

import {
  type EmailVerificationTokenRepository,
  RegisterUser,
} from "@/modules/auth/application/register-user";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { registerInputSchema } from "@/modules/auth/schemas/register-input";
import { FakeEmailProvider } from "@/modules/email/infrastructure/fake-email-provider";

describe("RegisterUser", () => {
  it("creates a pending user, stores hashed credentials and sends verification", async () => {
    const users = {
      findByNormalizedEmail: vi.fn().mockResolvedValue(null),
      findByNormalizedNickname: vi.fn().mockResolvedValue(null),
      create: vi
        .fn()
        .mockResolvedValue({ id: "user-id", email: "ana@example.com", firstName: "Ana" }),
    };
    const teams = {
      findById: vi
        .fn()
        .mockResolvedValue({ id: "11111111-1111-4111-8111-111111111111", isActive: true }),
    };
    const tokens: EmailVerificationTokenRepository = { create: vi.fn() };
    const emails = new FakeEmailProvider("test");
    const service = new RegisterUser(
      users as never,
      teams as never,
      new Argon2PasswordHasher(),
      tokens,
      emails,
      "https://quiniela.test",
    );
    const input = registerInputSchema.parse({
      firstName: " Ana ",
      lastName: " López ",
      nickname: "Ana_1",
      email: " ANA@Example.COM ",
      password: "correct-horse-battery",
      passwordConfirmation: "correct-horse-battery",
      favoriteTeamId: "11111111-1111-4111-8111-111111111111",
      acceptedRules: true,
    });
    await expect(service.execute(input, new Date("2026-07-24T00:00:00.000Z"))).resolves.toEqual({
      userId: "user-id",
      emailSent: true,
    });
    expect(users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ana@example.com",
        nicknameNormalized: "ana_1",
        status: "PENDING_EMAIL_CONFIRMATION",
      }),
    );
    expect(tokens.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-id",
        tokenHash: expect.not.stringContaining("token"),
      }),
    );
    expect(emails.sentEmails[0]?.recipient).toBe("ana@example.com");
  });
  it("rejects invalid passwords and duplicate email before creating a user", async () => {
    expect(() =>
      registerInputSchema.parse({
        firstName: "Ana",
        lastName: "López",
        nickname: "ana",
        email: "ana@example.com",
        password: "short",
        passwordConfirmation: "other",
        favoriteTeamId: "11111111-1111-4111-8111-111111111111",
        acceptedRules: true,
      }),
    ).toThrow();
  });
});
