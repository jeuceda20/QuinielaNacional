import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getApiSession, hasApiRole } from "@/lib/api/session";
import {
  RescheduleMatch,
  rescheduleMatchSchema,
} from "@/modules/matches/application/reschedule-match";
import { PrismaMatchRescheduleRepository } from "@/modules/matches/infrastructure/prisma-match-reschedule-repository";

type RouteContext = Readonly<{ params: Promise<{ matchId: string }> }>;

export async function POST(request: NextRequest, { params }: RouteContext) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  if (!hasApiRole(session, ["ADMIN", "SUPER_ADMIN"]))
    return apiError(403, "FORBIDDEN", "No autorizado.");
  const body: unknown = await request.json().catch(() => null);
  const parsed = rescheduleMatchSchema.safeParse({
    ...(typeof body === "object" && body ? body : {}),
    matchId: (await params).matchId,
    scheduledAt: typeof body === "object" && body ? Reflect.get(body, "newScheduledAt") : undefined,
  });
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.");
  try {
    await new RescheduleMatch(new PrismaMatchRescheduleRepository()).execute(
      session.user,
      parsed.data,
      new Date(),
    );
    return apiSuccess({ matchId: parsed.data.matchId, status: "RESCHEDULED" });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INVALID_STATE";
    return apiError(
      code === "NOT_FOUND" ? 404 : 409,
      code === "NOT_FOUND" ? "MATCH_NOT_FOUND" : "MATCH_NOT_PROCESSABLE",
      "No fue posible reprogramar el partido.",
    );
  }
}
