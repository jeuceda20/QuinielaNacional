import {
  type AccountApprovedEmailInput,
  EmailDeliveryError,
  type EmailProvider,
  type PasswordResetEmailInput,
  type TestEmailInput,
  type VerificationEmailInput,
} from "@/modules/email/domain/email-provider";
import { RateLimiter, rateLimitRules } from "@/modules/security/application/rate-limiter";

export class RateLimitedEmailProvider implements EmailProvider {
  public constructor(
    private readonly emails: EmailProvider,
    private readonly limiter: RateLimiter,
  ) {}

  public async sendVerificationEmail(input: VerificationEmailInput): Promise<void> {
    await this.consume(input.recipient);
    await this.emails.sendVerificationEmail(input);
  }

  public async sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<void> {
    await this.consume(input.recipient);
    await this.emails.sendPasswordResetEmail(input);
  }

  public async sendAccountApprovedEmail(input: AccountApprovedEmailInput): Promise<void> {
    await this.consume(input.recipient);
    await this.emails.sendAccountApprovedEmail(input);
  }

  public async sendTestEmail(input: TestEmailInput): Promise<void> {
    await this.consume(input.recipient);
    await this.emails.sendTestEmail(input);
  }

  private async consume(recipient: string): Promise<void> {
    const allowed = await this.limiter.consume(
      "smtp:recipient",
      recipient,
      rateLimitRules.smtpByRecipient,
      new Date(),
    );
    if (!allowed) throw new EmailDeliveryError("TEMPORARY");
  }
}
