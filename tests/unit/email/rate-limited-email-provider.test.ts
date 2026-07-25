import { describe, expect, it, vi } from "vitest";

import { EmailDeliveryError } from "@/modules/email/domain/email-provider";
import { RateLimitedEmailProvider } from "@/modules/email/infrastructure/rate-limited-email-provider";

describe("RateLimitedEmailProvider", () => {
  const input = {
    recipient: "ana@example.com",
    recipientName: "Ana",
    verificationUrl: "https://app.test",
  };

  it("sends email after consuming the recipient bucket", async () => {
    const emails = {
      sendVerificationEmail: vi.fn(),
      sendPasswordResetEmail: vi.fn(),
      sendAccountApprovedEmail: vi.fn(),
      sendTestEmail: vi.fn(),
    };
    const limiter = { consume: vi.fn().mockResolvedValue(true) };
    const provider = new RateLimitedEmailProvider(emails, limiter as never);

    await provider.sendVerificationEmail(input);

    expect(limiter.consume).toHaveBeenCalled();
    expect(emails.sendVerificationEmail).toHaveBeenCalledWith(input);
  });

  it("does not dispatch an email when the bucket is exhausted", async () => {
    const emails = {
      sendVerificationEmail: vi.fn(),
      sendPasswordResetEmail: vi.fn(),
      sendAccountApprovedEmail: vi.fn(),
      sendTestEmail: vi.fn(),
    };
    const provider = new RateLimitedEmailProvider(emails, {
      consume: vi.fn().mockResolvedValue(false),
    } as never);

    await expect(provider.sendVerificationEmail(input)).rejects.toBeInstanceOf(EmailDeliveryError);
    expect(emails.sendVerificationEmail).not.toHaveBeenCalled();
  });
});
