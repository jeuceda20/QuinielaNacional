import type { NextRequest } from "next/server";
import { z } from "zod";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getApiSession, hasApiRole } from "@/lib/api/session";
import { createRequestContext } from "@/lib/request-context";
import { ProcessMatchResultService } from "@/modules/results/application/process-match-result";
import { PrismaProcessMatchResultRepository } from "@/modules/results/infrastructure/prisma-process-match-result-repository";

const bodySchema = z.object({
  officialHomeGoals: z.number().int().min(0),
  officialAwayGoals: z.number().int().min(0),
  confirmation: z.literal(true),
});
type RouteContext = Readonly<{ params: Promise<{ matchId: string }> }>;

export async function POST(request: NextRequest, { params }: RouteContext) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  if (!hasApiRole(session, ["ADMIN", "SUPER_ADMIN"]))
    return apiError(403, "FORBIDDEN", "No autorizado.");
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.");
  try {
    const { matchId } = await params;
    await new ProcessMatchResultService(new PrismaProcessMatchResultRepository()).execute(
      createRequestContext({ userId: session.user.id, role: session.user.role }),
      {
        matchId,
        homeGoals: parsed.data.officialHomeGoals,
        awayGoals: parsed.data.officialAwayGoals,
      },
      new Date(),
    );
    return apiSuccess({ matchId, status: "PROCESSED" });
  } catch (error) {
    const code = error instanceof Error ? error.message : "MATCH_NOT_PROCESSABLE";
    return apiError(
      code === "MATCH_NOT_FOUND" ? 404 : 409,
      code,
      "No fue posible procesar el resultado.",
    );
  }
}
