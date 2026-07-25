import type { SeasonCreationRepository } from "@/modules/sports/application/create-season";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaSeasonCreationRepository implements SeasonCreationRepository {
  public constructor(
    private readonly db: Pick<PrismaClient, "season" | "auditLog" | "$transaction"> = prisma,
  ) {}
  async createDraft(input: Parameters<SeasonCreationRepository["createDraft"]>[0]) {
    try {
      await this.db.$transaction(async (t) => {
        const season = await t.season.create({
          data: {
            name: input.name,
            slug: input.slug,
            status: "DRAFT",
            startsAt: input.startsAt,
            endsAt: input.endsAt ?? null,
            exactPoints: input.exactPoints,
            partialPoints: input.partialPoints,
            wrongPoints: input.wrongPoints,
            doubleMultiplier: input.doubleMultiplier,
            predictionCloseMinutes: input.predictionCloseMinutes,
            maxPredictionGoals: input.maxPredictionGoals,
          },
        });
        await t.auditLog.create({
          data: {
            actorUserId: input.actorId,
            actorRole: "ADMIN",
            action: "SEASON_CREATED",
            entityType: "SEASON",
            entityId: season.id,
            afterJson: { status: "DRAFT", exactPoints: 3, partialPoints: 1, doubleMultiplier: 2 },
            requestId: input.requestId ?? null,
          },
        });
      });
      return "CREATED" as const;
    } catch {
      return "DUPLICATE" as const;
    }
  }
}
