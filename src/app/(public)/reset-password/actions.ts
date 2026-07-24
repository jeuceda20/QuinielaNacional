"use server";

import {
  PasswordRecovery,
  passwordResetSchema,
} from "@/modules/auth/application/password-recovery";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaPasswordResetTokenRepository } from "@/modules/auth/infrastructure/prisma-password-reset-token-repository";
import { GmailSmtpEmailProvider } from "@/modules/email/infrastructure/gmail-smtp-email-provider";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";

import { env } from "@/lib/env/server";
import { prisma } from "@/lib/prisma";

export type ResetPasswordActionState = Readonly<{
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}>;
export const initialResetPasswordActionState: ResetPasswordActionState = {
  success: false,
  message: "",
};

function createPasswordRecovery() {
  return new PasswordRecovery(
    new PrismaUserRepository(),
    new PrismaPasswordResetTokenRepository(),
    new Argon2PasswordHasher(),
    new GmailSmtpEmailProvider({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      appPassword: env.SMTP_APP_PASSWORD,
    }),
    { consume: async () => true },
    env.APP_URL,
    async (userId, now) => {
      await prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: now },
      });
    },
  );
}

export async function resetPasswordAction(
  _: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  const parsed = passwordResetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los datos ingresados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const updated = await createPasswordRecovery().reset(parsed.data, new Date());
  return updated
    ? { success: true, message: "Tu contraseÃ±a fue actualizada. Inicia sesiÃ³n nuevamente." }
    : { success: false, message: "El enlace no es vÃ¡lido o ha expirado." };
}
