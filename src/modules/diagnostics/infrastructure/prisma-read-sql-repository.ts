import type { ReadSqlRepository } from "@/modules/diagnostics/application/read-sql-console";
import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaReadSqlRepository implements ReadSqlRepository {
  public constructor(
    private readonly db: Pick<PrismaClient, "$queryRawUnsafe" | "auditLog"> = prisma,
  ) {}
  async query(sql: string): Promise<readonly Record<string, unknown>[]> {
    return this.db.$queryRawUnsafe(sql) as Promise<readonly Record<string, unknown>[]>;
  }
  async audit(sql: string, actorUserId: string, requestId: string): Promise<void> {
    await this.db.auditLog.create({
      data: {
        actorUserId,
        actorRole: "SUPER_ADMIN",
        action: "SQL_QUERY_EXECUTED",
        entityType: "SYSTEM",
        metadataJson: { sql },
        requestId,
      },
    });
  }
}
