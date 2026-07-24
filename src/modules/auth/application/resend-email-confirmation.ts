import { createHash, randomBytes } from "node:crypto";

import type { EmailProvider } from "@/modules/email/domain/email-provider";
import type { UserRepository } from "@/modules/users/domain/user-repository";

export interface ConfirmationTokenManager {
  invalidateActiveForUser(userId: string, now: Date): Promise<void>;
  create(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void>;
}

export interface ConfirmationResendRateLimiter {
  consume(ipAddress: string | null, emailNormalized: string, now: Date): Promise<boolean>;
}

export const resendConfirmationMessage =
  "Si la cuenta existe y necesita confirmación, enviaremos un nuevo enlace.";

export class ResendEmailConfirmation {
  public constructor(
    private readonly users: UserRepository,
    private readonly tokens: ConfirmationTokenManager,
    private readonly emails: EmailProvider,
    private readonly rateLimiter: ConfirmationResendRateLimiter,
    private readonly appUrl: string,
  ) {}

  public async execute(
    email: string,
    ipAddress: string | null,
    now: Date,
  ): Promise<{ message: string }> {
    const emailNormalized = email.trim().toLowerCase();
    if (!(await this.rateLimiter.consume(ipAddress, emailNormalized, now)))
      return { message: resendConfirmationMessage };
    const user = await this.users.findByNormalizedEmail(emailNormalized);
    if (!user || user.status !== "PENDING_EMAIL_CONFIRMATION")
      return { message: resendConfirmationMessage };
    const token = randomBytes(32).toString("base64url");
    await this.tokens.invalidateActiveForUser(user.id, now);
    await this.tokens.create({
      userId: user.id,
      tokenHash: createHash("sha256").update(token).digest("hex"),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });
    try {
      await this.emails.sendVerificationEmail({
        recipient: user.email,
        recipientName: user.firstName,
        verificationUrl: new URL(
          `/confirm-email?token=${encodeURIComponent(token)}`,
          this.appUrl,
        ).toString(),
      });
    } catch {
      /* Tokens remain available for a later resend. */
    }
    return { message: resendConfirmationMessage };
  }
}
