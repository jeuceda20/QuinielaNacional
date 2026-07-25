import type {
  PublicStanding,
  PublicStandingsRepository,
} from "@/modules/standings/application/get-public-standings";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

export class PrismaPublicStandingsRepository implements PublicStandingsRepository {
  public constructor(private readonly database: Pick<PrismaClient, "season"> = prisma) {}

  public async list(): Promise<readonly PublicStanding[]> {
    const season = await this.database.season.findFirst({
      where: { status: "ACTIVE", archivedAt: null },
      orderBy: { startsAt: "desc" },
      select: {
        standings: {
          orderBy: [{ position: "asc" }, { user: { nickname: "asc" } }],
          select: {
            position: true,
            previousPosition: true,
            totalPoints: true,
            exactCount: true,
            partialCount: true,
            user: { select: { nickname: true } },
          },
        },
      },
    });
    return (season?.standings ?? []).map((standing) => ({
      position: standing.position,
      nickname: standing.user.nickname,
      partialCount: standing.partialCount,
      exactCount: standing.exactCount,
      totalPoints: standing.totalPoints,
      previousPosition: standing.previousPosition,
    }));
  }
}
