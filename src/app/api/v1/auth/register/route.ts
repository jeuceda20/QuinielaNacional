import type { NextRequest } from "next/server";

import { RegistrationError } from "@/modules/auth/application/register-user";
import {
  consumeRegistrationRateLimit,
  createRegistrationService,
} from "@/modules/auth/infrastructure/create-auth-services";
import { registerInputSchema } from "@/modules/auth/schemas/register-input";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getIpAddressFromHeaders } from "@/lib/request-metadata";

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = registerInputSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  const now = new Date();
  if (!(await consumeRegistrationRateLimit(getIpAddressFromHeaders(request.headers), now)))
    return apiError(429, "AUTH_RATE_LIMITED", "Demasiados intentos. Inténtalo más tarde.");
  try {
    await createRegistrationService().execute(parsed.data, now);
    return apiSuccess(
      {
        status: "PENDING_APPROVAL",
        message: "Tu solicitud fue enviada y está pendiente de aprobación por un administrador.",
      },
      201,
    );
  } catch (error) {
    if (error instanceof RegistrationError) {
      const code =
        error.code === "EMAIL_IN_USE"
          ? "USER_EMAIL_ALREADY_EXISTS"
          : error.code === "NICKNAME_IN_USE"
            ? "USER_NICKNAME_ALREADY_EXISTS"
            : "TEAM_UNAVAILABLE";
      return apiError(409, code, "El correo, nickname o equipo no están disponibles.");
    }
    throw error;
  }
}
