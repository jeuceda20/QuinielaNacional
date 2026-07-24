export type EmailLocale = "es-HN";

export type VerificationEmailInput = Readonly<{
  recipient: string;
  recipientName: string;
  verificationUrl: string;
  locale?: EmailLocale;
}>;

export type PasswordResetEmailInput = Readonly<{
  recipient: string;
  recipientName: string;
  passwordResetUrl: string;
  locale?: EmailLocale;
}>;

export type AccountApprovedEmailInput = Readonly<{
  recipient: string;
  recipientName: string;
  locale?: EmailLocale;
}>;

export type TestEmailInput = Readonly<{
  recipient: string;
  locale?: EmailLocale;
}>;

export type EmailDeliveryFailureKind = "TEMPORARY" | "PERMANENT" | "TIMEOUT";

export class EmailDeliveryError extends Error {
  public constructor(public readonly kind: EmailDeliveryFailureKind) {
    super("No fue posible entregar el correo.");
    this.name = "EmailDeliveryError";
  }
}

export interface EmailProvider {
  sendVerificationEmail(input: VerificationEmailInput): Promise<void>;
  sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<void>;
  sendAccountApprovedEmail(input: AccountApprovedEmailInput): Promise<void>;
  sendTestEmail(input: TestEmailInput): Promise<void>;
}
