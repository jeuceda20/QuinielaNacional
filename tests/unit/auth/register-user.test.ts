import { describe, expect, it, vi } from "vitest";

import { RegisterUser } from "@/modules/auth/application/register-user";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { registerInputSchema } from "@/modules/auth/schemas/register-input";

describe("RegisterUser", () => {
  it("creates a pending user and stores hashed credentials", async () => {
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
    const service = new RegisterUser(users as never, teams as never, new Argon2PasswordHasher());
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
      emailSent: false,
    });
    expect(users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ana@example.com",
        nicknameNormalized: "ana_1",
        status: "PENDING_APPROVAL",
      }),
    );
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
