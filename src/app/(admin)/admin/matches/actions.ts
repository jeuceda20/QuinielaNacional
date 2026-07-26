"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { CancelMatch, cancelMatchSchema } from "@/modules/matches/application/cancel-match";
import { CreateMatch, createMatchSchema } from "@/modules/matches/application/create-match";
import {
  ManageMatchSuspension,
  suspendMatchSchema,
} from "@/modules/matches/application/manage-match-suspension";
import {
  RescheduleMatch,
  rescheduleMatchSchema,
} from "@/modules/matches/application/reschedule-match";
import { SetDoubleMatch } from "@/modules/matches/application/set-double-match";
import { PrismaDoubleMatchRepository } from "@/modules/matches/infrastructure/prisma-double-match-repository";
import { PrismaMatchCancellationRepository } from "@/modules/matches/infrastructure/prisma-match-cancellation-repository";
import { PrismaMatchCreationRepository } from "@/modules/matches/infrastructure/prisma-match-creation-repository";
import { PrismaMatchRescheduleRepository } from "@/modules/matches/infrastructure/prisma-match-reschedule-repository";
import { PrismaMatchSuspensionRepository } from "@/modules/matches/infrastructure/prisma-match-suspension-repository";

import { prisma } from "@/lib/prisma";
async function actor() {
  const t = (await cookies()).get("session")?.value,
    s = t ? await new SessionService(new PrismaSessionRepository()).validate(t, new Date()) : null;
  if (!s || (s.user.role !== "ADMIN" && s.user.role !== "SUPER_ADMIN"))
    throw new Error("No autorizado.");
  return s.user;
}
export async function matchAction(f: FormData) {
  const a = await actor(),
    id = String(f.get("matchId")),
    action = String(f.get("action")),
    now = new Date();
  if (action === "create")
    await new CreateMatch(new PrismaMatchCreationRepository()).execute(
      a,
      createMatchSchema.parse({
        roundId: f.get("roundId"),
        homeTeamId: f.get("homeTeamId"),
        awayTeamId: f.get("awayTeamId"),
        scheduledAt: f.get("scheduledAt"),
      }),
      now,
    );
  else if (action === "reschedule")
    await new RescheduleMatch(new PrismaMatchRescheduleRepository()).execute(
      a,
      rescheduleMatchSchema.parse({
        matchId: id,
        scheduledAt: f.get("scheduledAt"),
        reason: f.get("reason"),
      }),
      now,
    );
  else if (action === "double")
    await new SetDoubleMatch(new PrismaDoubleMatchRepository()).execute(a, id, now);
  else if (action === "suspend")
    await new ManageMatchSuspension(new PrismaMatchSuspensionRepository()).suspend(
      a,
      suspendMatchSchema.parse({ matchId: id, reason: f.get("reason") }),
      now,
    );
  else if (action === "resume")
    await new ManageMatchSuspension(new PrismaMatchSuspensionRepository()).resume(a, id, now);
  else if (action === "cancel")
    await new CancelMatch(new PrismaMatchCancellationRepository()).execute(
      a,
      cancelMatchSchema.parse({ matchId: id, reason: f.get("reason") }),
      now,
    );
  else if (action === "finish") {
    const updated = await prisma.match.updateMany({
      where: {
        id,
        archivedAt: null,
        status: { in: ["SCHEDULED", "RESCHEDULED", "CLOSED", "SUSPENDED", "RESUMED"] },
      },
      data: { status: "FINISHED_PENDING" },
    });
    if (!updated.count) throw new Error("El partido no puede recibir resultado en su estado actual.");
  }
  revalidatePath("/admin/matches");
}
