import type { NextRequest } from "next/server";

import { z } from "zod";

import {
  savePredictionSchema,
  SavePredictionService,
} from "@/modules/predictions/application/save-prediction";
import { revalidatePredictionCaches } from "@/modules/predictions/infrastructure/prediction-cache";
import { PrismaPredictionVisibilityRepository } from "@/modules/predictions/infrastructure/prisma-prediction-visibility-repository";
import { PrismaSavePredictionRepository } from "@/modules/predictions/infrastructure/prisma-save-prediction-repository";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getApiSession } from "@/lib/api/session";
import { createRequestContext } from "@/lib/request-context";

type RouteContext = Readonly<{ params: Promise<{ matchId: string }> }>;
const paramsSchema = z.object({ matchId: z.string().uuid() });

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success)
    return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  const repository = new PrismaPredictionVisibilityRepository();
  if (!(await repository.getClosesAt(parsed.data.matchId)))
    return apiError(404, "MATCH_NOT_FOUND", "El partido no existe.");
  const prediction = await repository.getOwn(parsed.data.matchId, session.user.id);
  return apiSuccess(prediction[0] ?? null);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  const body: unknown = await request.json().catch(() => null);
  const { matchId } = await params;
  const parsed = savePredictionSchema.safeParse({
    matchId,
    homeGoals: typeof body === "object" && body ? Reflect.get(body, "homeGoals") : undefined,
    awayGoals: typeof body === "object" && body ? Reflect.get(body, "awayGoals") : undefined,
  });
  if (!parsed.success)
    return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  try {
    await new SavePredictionService(new PrismaSavePredictionRepository()).execute(
      createRequestContext({ userId: session.user.id, role: session.user.role }),
      parsed.data,
      new Date(),
    );
    revalidatePredictionCaches(matchId);
    return apiSuccess({ matchId, status: "SAVED" });
  } catch (error) {
    if (error instanceof Error && error.message === "MATCH_CLOSED")
      return apiError(
        409,
        "PREDICTION_CLOSED",
        "El periodo de pronóstico de este partido ya cerró.",
      );
    if (error instanceof Error && error.message === "MATCH_NOT_FOUND")
      return apiError(404, "MATCH_NOT_FOUND", "El partido no existe.");
    if (error instanceof Error && error.message === "NOT_PARTICIPANT")
      return apiError(403, "PREDICTION_NOT_ALLOWED", "No participas en esta temporada.");
    throw error;
  }
}
