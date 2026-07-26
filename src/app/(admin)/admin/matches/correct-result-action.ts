"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import {
  correctMatchResultSchema,
  CorrectMatchResultService,
} from "@/modules/results/application/correct-match-result";
import { PrismaMatchResultCorrectionRepository } from "@/modules/results/infrastructure/prisma-match-result-correction-repository";

import { createRequestContext } from "@/lib/request-context";

export async function correctResultAction(formData: FormData) {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session || session.user.role !== "SUPER_ADMIN") throw new Error("No autorizado.");

  const input = correctMatchResultSchema.parse({
    matchId: formData.get("matchId"),
    homeGoals: Number(formData.get("homeGoals")),
    awayGoals: Number(formData.get("awayGoals")),
    reason: formData.get("reason"),
    password: formData.get("password"),
  });
  await new CorrectMatchResultService(
    new PrismaMatchResultCorrectionRepository(),
    new Argon2PasswordHasher(),
  ).execute(
    createRequestContext({ userId: session.user.id, role: session.user.role }),
    input,
    new Date(),
  );
  revalidatePath("/admin/matches");
  revalidatePath("/dashboard");
  revalidatePath("/standings");
  revalidatePath("/results");
}
