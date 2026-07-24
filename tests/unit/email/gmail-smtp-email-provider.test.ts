import type { Transporter } from "nodemailer";
import { describe, expect, it, vi } from "vitest";

import { GmailSmtpEmailProvider } from "@/modules/email/infrastructure/gmail-smtp-email-provider";

describe("GmailSmtpEmailProvider", () => {
  it("sends a simple Spanish verification message without exposing credentials", async () => {
    const transporter = { sendMail: vi.fn().mockResolvedValue({}) } as unknown as Transporter;
    const provider = new GmailSmtpEmailProvider(
      { host: "smtp.gmail.com", port: 587, user: "bot@example.com", appPassword: "secret" },
      transporter,
    );
    await provider.sendVerificationEmail({
      recipient: "ana@example.com",
      recipientName: "Ana",
      verificationUrl: "https://app.test/confirm",
    });
    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "ana@example.com",
        subject: "Confirma tu cuenta",
        text: expect.stringContaining("https://app.test/confirm"),
      }),
    );
  });
});
