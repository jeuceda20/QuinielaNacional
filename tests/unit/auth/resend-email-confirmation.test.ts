import { describe, expect, it, vi } from "vitest";

import {
  resendConfirmationMessage,
  ResendEmailConfirmation,
} from "@/modules/auth/application/resend-email-confirmation";
import { FakeEmailProvider } from "@/modules/email/infrastructure/fake-email-provider";

describe("ResendEmailConfirmation", () => {
  it("invalidates previous tokens and sends a replacement for pending users", async () => {
    const users = {
      findByNormalizedEmail: vi.fn().mockResolvedValue({
        id: "u",
        email: "ana@example.com",
        firstName: "Ana",
        status: "PENDING_EMAIL_CONFIRMATION",
      }),
    };
    const tokens = { invalidateActiveForUser: vi.fn(), create: vi.fn() };
    const rateLimiter = { consume: vi.fn().mockResolvedValue(true) };
    const emails = new FakeEmailProvider("test");
    const result = await new ResendEmailConfirmation(
      users as never,
      tokens,
      emails,
      rateLimiter,
      "https://app.test",
    ).execute(" ANA@example.com ", "127.0.0.1", new Date());
    expect(result).toEqual({ message: resendConfirmationMessage });
    expect(tokens.invalidateActiveForUser).toHaveBeenCalled();
    expect(tokens.create).toHaveBeenCalled();
    expect(emails.sentEmails).toHaveLength(1);
  });
  it("returns the same generic response for nonexistent users and rate limits", async () => {
    const users = { findByNormalizedEmail: vi.fn().mockResolvedValue(null) };
    const tokens = { invalidateActiveForUser: vi.fn(), create: vi.fn() };
    const emails = new FakeEmailProvider("test");
    const limited = new ResendEmailConfirmation(
      users as never,
      tokens,
      emails,
      { consume: vi.fn().mockResolvedValue(false) },
      "https://app.test",
    );
    await expect(limited.execute("none@example.com", null, new Date())).resolves.toEqual({
      message: resendConfirmationMessage,
    });
  });
});
