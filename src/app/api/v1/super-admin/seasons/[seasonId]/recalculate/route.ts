import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getApiSession, hasApiRole } from "@/lib/api/session";
import { createRequestContext } from "@/lib/request-context";
import { RecalculateSeasonService } from "@/modules/standings/application/recalculate-season";
import { PrismaSeasonRecalculationRepository } from "@/modules/standings/infrastructure/prisma-season-recalculation-repository";

type RouteContext = Readonly<{ params: Promise<{ seasonId: string }> }>;

export async function POST(request: NextRequest, { params }: RouteContext) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  if (!hasApiRole(session, ["SUPER_ADMIN"])) return apiError(403, "FORBIDDEN", "No autorizado.");
  try {
    const { seasonId } = await params;
    const summary = await new RecalculateSeasonService(
      new PrismaSeasonRecalculationRepository(),
    ).execute(
      createRequestContext({ userId: session.user.id, role: session.user.role }),
      seasonId,
      new Date(),
    );
    return apiSuccess(summary);
  } catch (error) {
    const code = error instanceof Error ? error.message : "SEASON_NOT_FOUND";
    return apiError(
      code === "SEASON_NOT_FOUND" ? 404 : 409,
      code,
      "No fue posible recalcular la temporada.",
    );
  }
}
