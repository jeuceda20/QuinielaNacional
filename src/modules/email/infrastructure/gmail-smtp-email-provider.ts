import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

import {
  type AccountApprovedEmailInput,
  EmailDeliveryError,
  type EmailProvider,
  type PasswordResetEmailInput,
  type TestEmailInput,
  type VerificationEmailInput,
} from "@/modules/email/domain/email-provider";

export type GmailSmtpConfiguration = Readonly<{
  host: string;
  port: number;
  user: string;
  appPassword: string;
  fromName?: string;
}>;

export class GmailSmtpEmailProvider implements EmailProvider {
  private readonly transporter: Transporter;
  private readonly from: string;
  public constructor(configuration: GmailSmtpConfiguration, transporter?: Transporter) {
    this.transporter =
      transporter ??
      nodemailer.createTransport({
        host: configuration.host,
        port: configuration.port,
        secure: false,
        auth: { user: configuration.user, pass: configuration.appPassword },
      });
    this.from = `${configuration.fromName ?? "Quiniela Nacional"} <${configuration.user}>`;
  }
  public async sendVerificationEmail(input: VerificationEmailInput): Promise<void> {
    await this.send(
      input.recipient,
      "Confirma tu cuenta",
      `Confirma tu cuenta: ${input.verificationUrl}`,
    );
  }
  public async sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<void> {
    await this.send(
      input.recipient,
      "Restablece tu contraseña",
      `Restablece tu contraseña: ${input.passwordResetUrl}`,
    );
  }
  public async sendAccountApprovedEmail(input: AccountApprovedEmailInput): Promise<void> {
    await this.send(
      input.recipient,
      "Tu cuenta fue aprobada",
      `Hola ${input.recipientName}, tu cuenta fue aprobada.`,
    );
  }
  public async sendTestEmail(input: TestEmailInput): Promise<void> {
    await this.send(
      input.recipient,
      "Correo de prueba",
      "La configuración SMTP funciona correctamente.",
    );
  }
  private async send(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, text });
    } catch {
      throw new EmailDeliveryError("TEMPORARY");
    }
  }
}
