"use server";

import { z } from "zod";

import { PasswordRecovery } from "@/modules/auth/application/password-recovery";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaPasswordResetTokenRepository } from "@/modules/auth/infrastructure/prisma-password-reset-token-repository";
import { GmailSmtpEmailProvider } from "@/modules/email/infrastructure/gmail-smtp-email-provider";
import { RateLimitedEmailProvider } from "@/modules/email/infrastructure/rate-limited-email-provider";
import { RateLimiter, rateLimitRules } from "@/modules/security/application/rate-limiter";
import { PrismaRateLimitRepository } from "@/modules/security/infrastructure/prisma-rate-limit-repository";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";

import { env } from "@/lib/env/server";
import { prisma } from "@/lib/prisma";

const emailSchema = z.string().trim().email("Ingresa un correo electrÃ³nico vÃ¡lido.");
export type ForgotPasswordActionState = Readonly<{
  success: boolean;
  message: string;
  emailError?: string;
}>;
export const initialForgotPasswordActionState: ForgotPasswordActionState = {
  success: false,
  message: "",
};

function createPasswordRecovery() {
  return new PasswordRecovery(
    new PrismaUserRepository(),
    new PrismaPasswordResetTokenRepository(),
    new Argon2PasswordHasher(),
    new RateLimitedEmailProvider(
      new GmailSmtpEmailProvider({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        user: env.SMTP_USER,
        appPassword: env.SMTP_APP_PASSWORD,
      }),
      new RateLimiter(new PrismaRateLimitRepository()),
    ),
    {
      consume: (email, now) =>
        new RateLimiter(new PrismaRateLimitRepository()).consume(
          "password-recovery:email",
          email,
          rateLimitRules.passwordRecoveryByEmail,
          now,
        ),
    },
    env.APP_URL,
    async (userId, now) => {
      await prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: now },
      });
    },
  );
}

export async function forgotPasswordAction(
  _: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa el correo ingresado.",
      emailError: parsed.error.issues[0]?.message,
    };
  }

  const result = await createPasswordRecovery().request(parsed.data, new Date());
  return { success: true, message: result.message };
}
