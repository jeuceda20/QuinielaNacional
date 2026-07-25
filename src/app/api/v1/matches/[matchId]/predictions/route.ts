import type { NextRequest } from "next/server";

import { z } from "zod";

import { GetVisiblePredictions } from "@/modules/predictions/application/get-visible-predictions";
import { PrismaPredictionVisibilityRepository } from "@/modules/predictions/infrastructure/prisma-prediction-visibility-repository";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getApiSession } from "@/lib/api/session";

type RouteContext = Readonly<{ params: Promise<{ matchId: string }> }>;
const paramsSchema = z.object({ matchId: z.string().uuid() });

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.");
  const repository = new PrismaPredictionVisibilityRepository();
  const closesAt = await repository.getClosesAt(parsed.data.matchId);
  if (!closesAt) return apiError(404, "MATCH_NOT_FOUND", "El partido no existe.");
  if (new Date() < closesAt)
    return apiError(403, "PREDICTION_NOT_VISIBLE", "Los pronósticos aún no son visibles.");
  const predictions = await new GetVisiblePredictions(repository).execute(
    session.user.id,
    parsed.data.matchId,
    new Date(),
  );
  return apiSuccess(predictions);
}
