import { describe, expect, it, vi } from "vitest";

import {
  PasswordRecovery,
  passwordRecoveryMessage,
  passwordResetSchema,
} from "@/modules/auth/application/password-recovery";
import { FakeEmailProvider } from "@/modules/email/infrastructure/fake-email-provider";

describe("PasswordRecovery", () => {
  it("keeps requests generic and sends a reset only for eligible accounts", async () => {
    const users = {
      findByNormalizedEmail: vi.fn().mockResolvedValue({
        id: "u",
        email: "ana@example.com",
        firstName: "Ana",
        status: "APPROVED",
        emailVerifiedAt: new Date(),
      }),
    };
    const tokens = { invalidateActiveForUser: vi.fn(), create: vi.fn(), consumeAndReset: vi.fn() };
    const emails = new FakeEmailProvider("test");
    const service = new PasswordRecovery(
      users as never,
      tokens,
      { hash: vi.fn(), verify: vi.fn() },
      emails,
      { consume: vi.fn().mockResolvedValue(true) },
      "https://app.test",
      vi.fn(),
    );
    await expect(service.request("ANA@example.com", new Date())).resolves.toEqual({
      message: passwordRecoveryMessage,
    });
    expect(tokens.invalidateActiveForUser).toHaveBeenCalled();
    expect(emails.sentEmails).toHaveLength(1);
  });
  it("consumes the token, changes the hash and revokes sessions", async () => {
    const tokens = {
      invalidateActiveForUser: vi.fn(),
      create: vi.fn(),
      consumeAndReset: vi.fn().mockResolvedValue("u"),
    };
    const revoke = vi.fn();
    const service = new PasswordRecovery(
      { findByNormalizedEmail: vi.fn() } as never,
      tokens,
      { hash: vi.fn().mockResolvedValue("new-hash"), verify: vi.fn() },
      new FakeEmailProvider("test"),
      { consume: vi.fn() },
      "https://app.test",
      revoke,
    );
    const input = passwordResetSchema.parse({
      token: "a".repeat(43),
      password: "correct-horse-battery",
      passwordConfirmation: "correct-horse-battery",
    });
    await expect(service.reset(input, new Date())).resolves.toBe(true);
    expect(revoke).toHaveBeenCalledWith("u", expect.any(Date));
  });
});
