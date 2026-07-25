"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import {
  savePredictionSchema,
  SavePredictionService,
} from "@/modules/predictions/application/save-prediction";
import { PrismaSavePredictionRepository } from "@/modules/predictions/infrastructure/prisma-save-prediction-repository";

import { createRequestContext } from "@/lib/request-context";
export async function savePredictionAction(f: FormData) {
  const t = (await cookies()).get("session")?.value,
    s = t ? await new SessionService(new PrismaSessionRepository()).validate(t, new Date()) : null;
  if (!s) throw new Error("No autorizado.");
  await new SavePredictionService(new PrismaSavePredictionRepository()).execute(
    createRequestContext({ userId: s.user.id, role: s.user.role }),
    savePredictionSchema.parse({
      matchId: f.get("matchId"),
      homeGoals: Number(f.get("homeGoals")),
      awayGoals: Number(f.get("awayGoals")),
    }),
    new Date(),
  );
  revalidatePath("/predictions");
}
