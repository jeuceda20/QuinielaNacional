import type { NextRequest } from "next/server";

import { z } from "zod";

import { createAuthEmailProvider } from "@/modules/auth/infrastructure/create-auth-services";
import { ApproveUser, ApproveUserError } from "@/modules/users/application/approve-user";
import { PrismaUserApprovalRepository } from "@/modules/users/infrastructure/prisma-user-approval-repository";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getApiSession, hasApiRole } from "@/lib/api/session";
import { createRequestId } from "@/lib/request-id";

const bodySchema = z.object({ addToActiveSeason: z.boolean().default(false) });
type RouteContext = Readonly<{ params: Promise<{ userId: string }> }>;

export async function POST(request: NextRequest, { params }: RouteContext) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  if (!hasApiRole(session, ["ADMIN", "SUPER_ADMIN"]))
    return apiError(403, "FORBIDDEN", "No autorizado.");
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.");
  try {
    const outcome = await new ApproveUser(
      new PrismaUserRepository(),
      new PrismaUserApprovalRepository(),
      createAuthEmailProvider(),
    ).execute(
      {
        actor: session.user,
        userId: (await params).userId,
        addToActiveSeason: parsed.data.addToActiveSeason,
        requestId: createRequestId(),
      },
      new Date(),
    );
    return apiSuccess(outcome);
  } catch (error) {
    if (error instanceof ApproveUserError)
      return apiError(
        error.code === "USER_NOT_FOUND" ? 404 : 409,
        error.code,
        "No fue posible aprobar al usuario.",
      );
    throw error;
  }
}
