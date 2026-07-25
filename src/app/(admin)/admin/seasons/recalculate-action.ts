"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { RecalculateSeasonService } from "@/modules/standings/application/recalculate-season";
import { PrismaSeasonRecalculationRepository } from "@/modules/standings/infrastructure/prisma-season-recalculation-repository";

import { createRequestContext } from "@/lib/request-context";

export async function recalculateSeasonAction(formData: FormData) {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session || session.user.role !== "SUPER_ADMIN") throw new Error("No autorizado.");
  const context = createRequestContext({ userId: session.user.id, role: session.user.role });
  const startedAt = Date.now();
  const summary = await new RecalculateSeasonService(
    new PrismaSeasonRecalculationRepository(),
  ).execute(context, String(formData.get("seasonId")), new Date());
  revalidatePath("/admin/seasons");
  revalidatePath("/standings");
  revalidatePath("/results");
  return { ...summary, durationMilliseconds: Date.now() - startedAt, requestId: context.requestId };
}
