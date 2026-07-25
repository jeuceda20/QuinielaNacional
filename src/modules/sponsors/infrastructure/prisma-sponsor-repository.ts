import type {
  SponsorInput,
  SponsorRepository,
} from "@/modules/sponsors/application/manage-sponsor";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaSponsorRepository implements SponsorRepository {
  public constructor(private readonly database: Pick<PrismaClient, "sponsor"> = prisma) {}
  async create(input: SponsorInput) {
    await this.database.sponsor.create({ data: input });
  }
  async listActive(now: Date): Promise<readonly SponsorInput[]> {
    return this.database.sponsor.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: { displayOrder: "asc" },
      select: { name: true, imagePath: true, targetUrl: true, displayOrder: true, isActive: true },
    });
  }
}
