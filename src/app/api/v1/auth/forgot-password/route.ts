import type { NextRequest } from "next/server";

import { z } from "zod";

import { passwordRecoveryMessage } from "@/modules/auth/application/password-recovery";
import { createPasswordRecoveryService } from "@/modules/auth/infrastructure/create-auth-services";

import { apiError, apiSuccess } from "@/lib/api/response";

const bodySchema = z.object({ email: z.string().trim().email() });

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  await createPasswordRecoveryService(true).request(parsed.data.email, new Date());
  return apiSuccess({ message: passwordRecoveryMessage });
}
