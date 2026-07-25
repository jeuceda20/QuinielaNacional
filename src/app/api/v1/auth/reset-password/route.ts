import type { NextRequest } from "next/server";

import { passwordResetSchema } from "@/modules/auth/application/password-recovery";
import { createPasswordRecoveryService } from "@/modules/auth/infrastructure/create-auth-services";

import { apiError, apiSuccess } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  const parsed = passwordResetSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  if (!(await createPasswordRecoveryService(false).reset(parsed.data, new Date())))
    return apiError(410, "AUTH_RESET_TOKEN_INVALID", "El enlace no es válido o ha expirado.");
  return apiSuccess({ message: "La contraseña fue actualizada." });
}
