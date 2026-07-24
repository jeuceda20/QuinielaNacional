"use server";

import { RegisterUser, RegistrationError } from "@/modules/auth/application/register-user";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaEmailVerificationTokenRepository } from "@/modules/auth/infrastructure/prisma-email-verification-token-repository";
import { registerInputSchema } from "@/modules/auth/schemas/register-input";
import { GmailSmtpEmailProvider } from "@/modules/email/infrastructure/gmail-smtp-email-provider";
import { PrismaTeamRepository } from "@/modules/sports/infrastructure/prisma-sports-repositories";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";

import { env } from "@/lib/env/server";

export type RegisterActionState = Readonly<{
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}>;
export const initialRegisterActionState: RegisterActionState = { success: false, message: "" };

export async function registerAction(
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const parsed = registerInputSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
    favoriteTeamId: formData.get("favoriteTeamId"),
    acceptedRules: formData.get("acceptedRules") === "on",
  });
  if (!parsed.success)
    return {
      success: false,
      message: "Revisa los datos ingresados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  try {
    const service = new RegisterUser(
      new PrismaUserRepository(),
      new PrismaTeamRepository(),
      new Argon2PasswordHasher(),
      new PrismaEmailVerificationTokenRepository(),
      new GmailSmtpEmailProvider({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        user: env.SMTP_USER,
        appPassword: env.SMTP_APP_PASSWORD,
      }),
      env.APP_URL,
    );
    await service.execute(parsed.data, new Date());
    return { success: true, message: "Revisa tu correo para confirmar tu cuenta." };
  } catch (error) {
    if (error instanceof RegistrationError)
      return {
        success: false,
        message:
          error.code === "TEAM_UNAVAILABLE"
            ? "El equipo seleccionado no está disponible."
            : "El correo o nickname ya está en uso.",
      };
    return {
      success: false,
      message: "No fue posible completar el registro. Inténtalo nuevamente.",
    };
  }
}
