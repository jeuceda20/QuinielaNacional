"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import {
  processMatchResultSchema,
  ProcessMatchResultService,
} from "@/modules/results/application/process-match-result";
import { PrismaProcessMatchResultRepository } from "@/modules/results/infrastructure/prisma-process-match-result-repository";

import { prisma } from "@/lib/prisma";
import { createRequestContext } from "@/lib/request-context";

export async function processResultAction(formData: FormData) {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN"))
    throw new Error("No autorizado.");

  const input = processMatchResultSchema.parse({
    matchId: formData.get("matchId"),
    homeGoals: Number(formData.get("homeGoals")),
    awayGoals: Number(formData.get("awayGoals")),
  });
  const context = createRequestContext({ userId: session.user.id, role: session.user.role });
  const predictionCount = await prisma.prediction.count({
    where: { matchId: input.matchId, deletedAt: null },
  });
  const startedAt = Date.now();
  await new ProcessMatchResultService(new PrismaProcessMatchResultRepository()).execute(
    context,
    input,
    new Date(),
  );
  revalidatePath("/admin/matches");
  revalidatePath("/standings");
  revalidatePath("/results");
  return {
    durationMilliseconds: Date.now() - startedAt,
    predictionCount,
    requestId: context.requestId,
  };
}
