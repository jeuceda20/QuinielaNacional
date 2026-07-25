"use server";

import { cookies } from "next/headers";

import { loginInputSchema, LoginUser } from "@/modules/auth/application/login-user";
import {
  getSessionCookieOptions,
  SessionService,
} from "@/modules/auth/application/session-service";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { RateLimiter, rateLimitRules } from "@/modules/security/application/rate-limiter";
import { PrismaRateLimitRepository } from "@/modules/security/infrastructure/prisma-rate-limit-repository";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";

import { getRequestIpAddress } from "@/lib/request-metadata";

export type LoginActionState = Readonly<{
  status: "IDLE" | "INVALID" | "PENDING_EMAIL_CONFIRMATION" | "PENDING_APPROVAL";
  message: string;
}>;
export const initialLoginActionState: LoginActionState = { status: "IDLE", message: "" };
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
  const passwords = new Argon2PasswordHasher();
  const sessionService = new SessionService(new PrismaSessionRepository());
  const limiter = new RateLimiter(new PrismaRateLimitRepository());
  const login = new LoginUser(
    new PrismaUserRepository(),
    passwords,
    sessionService,
    {
      consume: async (ip, email, now) =>
        (await limiter.consume("login:ip", ip, rateLimitRules.loginByIp, now)) &&
        limiter.consume("login:email", email, rateLimitRules.loginByEmail, now),
    },
    await passwords.hash("timing-placeholder-password"),
  );
  const result = await login.execute(parsed.data, new Date());
  if (result.status === "AUTHENTICATED" && result.token && result.expiresAt) {
    (await cookies()).set("session", result.token, {
      ...getSessionCookieOptions(process.env.NODE_ENV === "production"),
      expires: result.expiresAt,
    });
    return { status: "IDLE", message: "" };
  }
  if (result.status === "PENDING_EMAIL_CONFIRMATION")
    return { status: result.status, message: "Debes confirmar tu correo." };
  if (result.status === "PENDING_APPROVAL")
    return { status: result.status, message: "Tu cuenta está pendiente de aprobación." };
  return { status: "INVALID", message: "Correo o contraseña incorrectos." };
}
