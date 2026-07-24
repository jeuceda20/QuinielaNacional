import { describe, expect, it } from "vitest";

import { FakeEmailProvider } from "@/modules/email/infrastructure/fake-email-provider";

describe("FakeEmailProvider", () => {
  it("captures sent verification emails and can clear state", async () => {
    const provider = new FakeEmailProvider("test");
    await provider.sendVerificationEmail({
      recipient: "ana@example.com",
      recipientName: "Ana",
      verificationUrl: "https://app.test/verify/token",
    });
    expect(provider.sentEmails).toEqual([
      {
        recipient: "ana@example.com",
        type: "VERIFICATION",
        subject: "Confirma tu cuenta",
        content: "https://app.test/verify/token",
      },
    ]);
    provider.clear();
    expect(provider.sentEmails).toEqual([]);
  });
  it("simulates delivery failures", async () => {
    const provider = new FakeEmailProvider("test");
    provider.failWith("TIMEOUT");
    await expect(provider.sendTestEmail({ recipient: "ana@example.com" })).rejects.toMatchObject({
      kind: "TIMEOUT",
    });
  });
  it("cannot be enabled in production", () => {
    expect(() => new FakeEmailProvider("production")).toThrow();
  });
});
