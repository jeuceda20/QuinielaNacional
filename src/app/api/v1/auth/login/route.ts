import type { NextRequest } from "next/server";

import { loginInputSchema } from "@/modules/auth/application/login-user";
import { getSessionCookieOptions } from "@/modules/auth/application/session-service";
import { createLoginService } from "@/modules/auth/infrastructure/create-auth-services";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getIpAddressFromHeaders } from "@/lib/request-metadata";

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = loginInputSchema.safeParse({
    ...(typeof body === "object" && body ? body : {}),
    ipAddress: getIpAddressFromHeaders(request.headers),
    userAgent: request.headers.get("user-agent"),
  });
  if (!parsed.success)
    return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  const result = await (await createLoginService()).execute(parsed.data, new Date());
  if (result.status === "PENDING_APPROVAL")
    return apiError(
      403,
      "AUTH_ACCOUNT_PENDING_APPROVAL",
      "Tu cuenta está pendiente de aprobación.",
    );
  if (result.status !== "AUTHENTICATED" || !result.token || !result.expiresAt)
    return apiError(401, "AUTH_INVALID_CREDENTIALS", "Correo o contraseña incorrectos.");
  const response = apiSuccess({ status: "AUTHENTICATED" });
  response.cookies.set("session", result.token, {
    ...getSessionCookieOptions(process.env.NODE_ENV === "production"),
    expires: result.expiresAt,
  });
  return response;
}
