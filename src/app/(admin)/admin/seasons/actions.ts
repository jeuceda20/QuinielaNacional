"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { ActivateSeason } from "@/modules/sports/application/activate-season";
import { AddSeasonParticipant } from "@/modules/sports/application/add-season-participant";
import { CreateSeason, createSeasonSchema } from "@/modules/sports/application/create-season";
import { ManageRound, roundSchema } from "@/modules/sports/application/manage-round";
import { PrismaRoundManagementRepository } from "@/modules/sports/infrastructure/prisma-round-management-repository";
import { PrismaSeasonActivationRepository } from "@/modules/sports/infrastructure/prisma-season-activation-repository";
import { PrismaSeasonCreationRepository } from "@/modules/sports/infrastructure/prisma-season-creation-repository";
import { PrismaSeasonParticipantRepository } from "@/modules/sports/infrastructure/prisma-season-participant-repository";

import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
async function actor() {
  const t = (await cookies()).get("session")?.value;
  const s = t
    ? await new SessionService(new PrismaSessionRepository()).validate(t, new Date())
    : null;
  if (!s || (s.user.role !== "ADMIN" && s.user.role !== "SUPER_ADMIN"))
    throw new Error("No autorizado.");
  return s.user;
}
export async function seasonAction(f: FormData) {
  const a = await actor(),
    now = new Date(),
    action = String(f.get("action"));
  if (action === "create")
    await new CreateSeason(new PrismaSeasonCreationRepository()).execute(
      a,
      createSeasonSchema.parse({
        name: f.get("name"),
        slug: slugify(String(f.get("name"))),
        startsAt: f.get("startsAt"),
        endsAt: f.get("endsAt") || null,
        maxPredictionGoals: 20,
      }),
      now,
    );
  else if (action === "activate") {
    await new ActivateSeason(new PrismaSeasonActivationRepository()).execute(
      a,
      String(f.get("seasonId")),
      now,
    );
    await new AddSeasonParticipant(new PrismaSeasonParticipantRepository()).execute(
      a,
      String(f.get("seasonId")),
      a.id,
      now,
    );
  }
  else if (action === "join")
    await new AddSeasonParticipant(new PrismaSeasonParticipantRepository()).execute(
      a,
      String(f.get("seasonId")),
      a.id,
      now,
    );
  else if (action === "close") {
    const updated = await prisma.season.updateMany({
      where: { id: String(f.get("seasonId")), status: "ACTIVE", archivedAt: null },
      data: { status: "CLOSED", closedAt: now },
    });
    if (!updated.count) throw new Error("La temporada no está activa o ya fue cerrada.");
  }
  else if (action === "participant")
    await new AddSeasonParticipant(new PrismaSeasonParticipantRepository()).execute(
      a,
      String(f.get("seasonId")),
      String(f.get("userId")),
      now,
    );
  else if (action === "round") {
    const seasonId = String(f.get("seasonId"));
    const last = await prisma.round.aggregate({
      where: { seasonId, archivedAt: null },
      _max: { sequence: true },
    });
    const sequence = Number(f.get("sequence")) || (last._max.sequence ?? 0) + 1;
    const name = String(f.get("roundName"));
    await new ManageRound(new PrismaRoundManagementRepository()).create(
      a,
      roundSchema.parse({
        seasonId,
        name,
        slug: `${slugify(name)}-${sequence}`,
        sequence,
      }),
      now,
    );
  }
  else if (action === "publish" || action === "archive")
    await new ManageRound(new PrismaRoundManagementRepository())[action](
      a,
      String(f.get("roundId")),
      now,
    );
  revalidatePath("/admin/seasons");
  revalidatePath("/admin/matches");
}
