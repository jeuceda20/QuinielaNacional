import {
  type AccountApprovedEmailInput,
  EmailDeliveryError,
  type EmailDeliveryFailureKind,
  type EmailProvider,
  type PasswordResetEmailInput,
  type TestEmailInput,
  type VerificationEmailInput,
} from "@/modules/email/domain/email-provider";

export type SentEmail = Readonly<{
  recipient: string;
  type: "VERIFICATION" | "PASSWORD_RESET" | "ACCOUNT_APPROVED" | "TEST";
  subject: string;
  content: string;
}>;

export class FakeEmailProvider implements EmailProvider {
  public readonly sentEmails: SentEmail[] = [];
  private failureKind: EmailDeliveryFailureKind | null = null;

  public constructor(
    environment: "development" | "test" | "production",
    enabledInDevelopment = false,
  ) {
    if (environment === "production" || (environment === "development" && !enabledInDevelopment)) {
      throw new Error("FakeEmailProvider is not enabled in this environment.");
    }
  }

  public failWith(kind: EmailDeliveryFailureKind): void {
    this.failureKind = kind;
  }
  public clear(): void {
    this.sentEmails.length = 0;
    this.failureKind = null;
  }
  public async sendVerificationEmail(input: VerificationEmailInput): Promise<void> {
    await this.send({
      recipient: input.recipient,
      type: "VERIFICATION",
      subject: "Confirma tu cuenta",
      content: input.verificationUrl,
    });
  }
  public async sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<void> {
    await this.send({
      recipient: input.recipient,
      type: "PASSWORD_RESET",
      subject: "Restablece tu contraseña",
      content: input.passwordResetUrl,
    });
  }
  public async sendAccountApprovedEmail(input: AccountApprovedEmailInput): Promise<void> {
    await this.send({
      recipient: input.recipient,
      type: "ACCOUNT_APPROVED",
      subject: "Tu cuenta fue aprobada",
      content: input.recipientName,
    });
  }
  public async sendTestEmail(input: TestEmailInput): Promise<void> {
    await this.send({
      recipient: input.recipient,
      type: "TEST",
      subject: "Correo de prueba",
      content: "Correo de prueba",
    });
  }

  private async send(email: SentEmail): Promise<void> {
    if (this.failureKind) throw new EmailDeliveryError(this.failureKind);
    this.sentEmails.push(email);
  }
}
