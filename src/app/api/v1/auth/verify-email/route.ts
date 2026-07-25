import type { NextRequest } from "next/server";

import { z } from "zod";

import {
  ConfirmEmail,
  InvalidEmailConfirmationTokenError,
} from "@/modules/auth/application/confirm-email";
import { PrismaEmailConfirmationRepository } from "@/modules/auth/infrastructure/prisma-email-confirmation-repository";

import { apiError, apiSuccess } from "@/lib/api/response";

const bodySchema = z.object({ token: z.string() });

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  try {
    const outcome = await new ConfirmEmail(new PrismaEmailConfirmationRepository()).execute(
      parsed.data.token,
      new Date(),
    );
    return apiSuccess({
      status: outcome === "CONFIRMED" ? "PENDING_APPROVAL" : "ALREADY_CONFIRMED",
      message:
        outcome === "CONFIRMED"
          ? "Tu correo fue confirmado. La cuenta está pendiente de aprobación."
          : "Tu correo ya había sido confirmado.",
    });
  } catch (error) {
    if (error instanceof InvalidEmailConfirmationTokenError)
      return apiError(
        410,
        "AUTH_EMAIL_VERIFICATION_INVALID",
        "El enlace no es válido o ha expirado.",
      );
    throw error;
  }
}
