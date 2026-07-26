"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { z } from "zod";

import { loginInputSchema } from "@/modules/auth/application/login-user";
import { ResendEmailConfirmation } from "@/modules/auth/application/resend-email-confirmation";
import { getSessionCookieOptions } from "@/modules/auth/application/session-service";
import { createAuthEmailProvider, createLoginService } from "@/modules/auth/infrastructure/create-auth-services";
import { PrismaEmailVerificationTokenRepository } from "@/modules/auth/infrastructure/prisma-email-verification-token-repository";
import type { LoginActionState } from "@/modules/auth/ui/action-states";
import { RateLimiter, rateLimitRules } from "@/modules/security/application/rate-limiter";
import { PrismaRateLimitRepository } from "@/modules/security/infrastructure/prisma-rate-limit-repository";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";

import { env } from "@/lib/env/server";
import { getRequestIpAddress } from "@/lib/request-metadata";
export async function loginAction(
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const ipAddress = await getRequestIpAddress();
  const parsed = loginInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    ipAddress,
    userAgent: null,
  });
  if (!parsed.success) return { status: "INVALID", message: "Correo o contraseña incorrectos." };
  const login = await createLoginService();
  const result = await login.execute(parsed.data, new Date());
  if (result.status === "AUTHENTICATED" && result.token && result.expiresAt) {
    (await cookies()).set("session", result.token, {
      ...getSessionCookieOptions(process.env.NODE_ENV === "production"),
      expires: result.expiresAt,
    });
    redirect("/dashboard");
  }
  if (result.status === "PENDING_EMAIL_CONFIRMATION")
    return { status: result.status, message: "Debes confirmar tu correo." };
  if (result.status === "PENDING_APPROVAL")
    return { status: result.status, message: "Tu cuenta está pendiente de aprobación." };
  return { status: "INVALID", message: "Correo o contraseña incorrectos." };
}

export async function resendConfirmationAction(email: string): Promise<string> {
  const parsed = z.string().trim().email().safeParse(email);
  if (!parsed.success) return "Ingresa un correo válido para reenviar la confirmación.";
  const limiter = new RateLimiter(new PrismaRateLimitRepository());
  const result = await new ResendEmailConfirmation(
    new PrismaUserRepository(),
    new PrismaEmailVerificationTokenRepository(),
    createAuthEmailProvider(),
    {
      consume: async (ipAddress, emailNormalized, now) =>
        (await limiter.consume("email-confirmation:ip", ipAddress, rateLimitRules.registrationByIp, now)) &&
        limiter.consume("email-confirmation:email", emailNormalized, rateLimitRules.registrationByIp, now),
    },
    env.APP_URL,
  ).execute(parsed.data, await getRequestIpAddress(), new Date());
  return result.message;
}
