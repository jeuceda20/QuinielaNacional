"use server";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import {
  savePredictionSchema,
  SavePredictionService,
} from "@/modules/predictions/application/save-prediction";
import { revalidatePredictionCaches } from "@/modules/predictions/infrastructure/prediction-cache";
import { PrismaSavePredictionRepository } from "@/modules/predictions/infrastructure/prisma-save-prediction-repository";

import { createRequestContext } from "@/lib/request-context";
export async function savePredictionAction(f: FormData) {
  const t = (await cookies()).get("session")?.value,
    s = t ? await new SessionService(new PrismaSessionRepository()).validate(t, new Date()) : null;
  if (!s) throw new Error("No autorizado.");
  const input = savePredictionSchema.parse({
    matchId: f.get("matchId"),
    homeGoals: Number(f.get("homeGoals")),
    awayGoals: Number(f.get("awayGoals")),
  });
  await new SavePredictionService(new PrismaSavePredictionRepository()).execute(
    createRequestContext({ userId: s.user.id, role: s.user.role }),
    input,
    new Date(),
  );
  revalidatePredictionCaches(input.matchId);
}
