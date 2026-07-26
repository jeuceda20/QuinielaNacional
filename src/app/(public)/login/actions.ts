"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginInputSchema } from "@/modules/auth/application/login-user";
import { getSessionCookieOptions } from "@/modules/auth/application/session-service";
import { createLoginService } from "@/modules/auth/infrastructure/create-auth-services";
import type { LoginActionState } from "@/modules/auth/ui/action-states";

import { getRequestIpAddress } from "@/lib/request-metadata";

export async function loginAction(
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    ipAddress: await getRequestIpAddress(),
    userAgent: null,
  });
  if (!parsed.success) return { status: "INVALID", message: "Correo o contraseña incorrectos." };

  const result = await (await createLoginService()).execute(parsed.data, new Date());
  if (result.status === "AUTHENTICATED" && result.token && result.expiresAt) {
    (await cookies()).set("session", result.token, {
      ...getSessionCookieOptions(process.env.NODE_ENV === "production"),
      expires: result.expiresAt,
    });
    redirect("/dashboard");
  }
  if (result.status === "PENDING_APPROVAL")
    return { status: result.status, message: "Tu cuenta está pendiente de aprobación." };
  return { status: "INVALID", message: "Correo o contraseña incorrectos." };
}
