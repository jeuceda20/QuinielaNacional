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

export type GmailSmtpConfiguration = Readonly<{ host: string; port: number; user: string; appPassword: string; fromName?: string; appUrl?: string }>;

export class GmailSmtpEmailProvider implements EmailProvider {
  private readonly transporter: Transporter;
  private readonly from: string;
  private readonly appUrl: string;
  public constructor(configuration: GmailSmtpConfiguration, transporter?: Transporter) {
    this.transporter = transporter ?? nodemailer.createTransport({ host: configuration.host, port: configuration.port, secure: false, auth: { user: configuration.user, pass: configuration.appPassword } });
    this.from = `${configuration.fromName ?? "Quiniela Nacional"} <${configuration.user}>`;
    this.appUrl = configuration.appUrl ?? "http://localhost:3000";
  }
  public async sendVerificationEmail(input: VerificationEmailInput) {
    await this.send(input.recipient, "Confirma tu cuenta de Quiniela Nacional", `Hola ${input.recipientName},\n\nConfirma tu cuenta abriendo este enlace:\n${input.verificationUrl}\n\nEl enlace vence en 24 horas.`, this.actionEmail("Confirma tu cuenta", `Hola ${input.recipientName},`, "Tu cuenta está casi lista. Confirma tu correo para continuar con el registro.", "Confirmar mi cuenta", input.verificationUrl, "El enlace vence en 24 horas. Si no solicitaste esta cuenta, ignora este mensaje."));
  }
  public async sendPasswordResetEmail(input: PasswordResetEmailInput) {
    await this.send(input.recipient, "Restablece tu contraseña de Quiniela Nacional", `Hola ${input.recipientName},\n\nSolicitaste restablecer tu contraseña:\n${input.passwordResetUrl}\n\nEl enlace vence en una hora.`, this.actionEmail("Restablece tu contraseña", `Hola ${input.recipientName},`, "Recibimos una solicitud para restablecer la contraseña de tu cuenta.", "Restablecer contraseña", input.passwordResetUrl, "El enlace vence en una hora. Si no solicitaste el cambio, ignora este mensaje."));
  }
  public async sendAccountApprovedEmail(input: AccountApprovedEmailInput) {
    await this.send(
      input.recipient,
      "Tu cuenta fue aprobada · Quiniela Nacional",
      `Hola ${input.recipientName},\n\nTu solicitud fue aprobada. Ya puedes iniciar sesión, pronosticar partidos y participar en la tabla de posiciones.`,
      this.actionEmail(
        "Tu cuenta fue aprobada",
        `Hola ${input.recipientName},`,
        "Tu solicitud fue aprobada. Ya puedes iniciar sesión, pronosticar partidos y competir en la tabla de posiciones.",
        "Ya puedes pronosticar",
        new URL("/login", this.appUrl).toString(),
        "¡Bienvenido a Quiniela Nacional!",
      ),
    );
  }
  public async sendTestEmail(input: TestEmailInput) { await this.send(input.recipient, "Correo de prueba", "La configuración SMTP funciona correctamente."); }
  private actionEmail(title: string, greeting: string, message: string, actionLabel: string, actionUrl: string, footer: string) {
    const escape = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
    return `<main style="max-width:560px;margin:0 auto;padding:32px;background:#111827;color:#f9fafb;font-family:Arial,sans-serif;border-radius:16px"><p style="color:#22d3ee;font-weight:700;letter-spacing:.08em">QUINIELA NACIONAL</p><h1 style="font-size:24px">${escape(title)}</h1><p>${escape(greeting)}</p><p style="color:#d1d5db;line-height:1.6">${escape(message)}</p><p style="margin:28px 0"><a href="${escape(actionUrl)}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">${escape(actionLabel)}</a></p><p style="color:#9ca3af;font-size:13px">${escape(footer)}</p></main>`;
  }
  private async send(to: string, subject: string, text: string, html?: string) {
    try { await this.transporter.sendMail({ from: this.from, to, subject, text, html }); }
    catch { throw new EmailDeliveryError("TEMPORARY"); }
  }
}
