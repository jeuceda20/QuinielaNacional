import type { InitialSetupRepository } from "@/modules/auth/application/initial-setup";

import { prisma } from "@/lib/prisma";

export class PrismaInitialSetupRepository implements InitialSetupRepository {
  public async createFirstSuperAdmin(
    input: Parameters<InitialSetupRepository["createFirstSuperAdmin"]>[0],
  ) {
    return prisma.$transaction(async (database) => {
      const existing = await database.user.findFirst({
        where: { role: "SUPER_ADMIN", deletedAt: null },
        select: { id: true },
      });
      if (existing) return "ALREADY_COMPLETED" as const;
      const { favoriteTeamId, now, ...user } = input;
      await database.user.create({
        data: {
          ...user,
          favoriteTeam: { connect: { id: favoriteTeamId } },
          role: "SUPER_ADMIN",
          status: "APPROVED",
          emailVerifiedAt: now,
          approvedAt: now,
        },
      });
      return "CREATED" as const;
    });
  }
}
