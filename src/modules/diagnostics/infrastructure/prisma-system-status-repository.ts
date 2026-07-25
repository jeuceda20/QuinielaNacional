import type { SystemStatusRepository } from "@/modules/diagnostics/application/get-system-status";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaSystemStatusRepository implements SystemStatusRepository {
  public constructor(private readonly database: Pick<PrismaClient, "$queryRaw"> = prisma) {}
  async checkDatabase() {
    try {
      await this.database.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
