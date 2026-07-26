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
      await database.user.create({
        data: {
          ...input,
          role: "SUPER_ADMIN",
          status: "APPROVED",
          emailVerifiedAt: input.now,
          approvedAt: input.now,
        },
      });
      return "CREATED" as const;
    });
  }
}
