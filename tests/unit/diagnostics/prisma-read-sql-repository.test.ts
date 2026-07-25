import { describe, expect, it, vi } from "vitest";

import { PrismaReadSqlRepository } from "@/modules/diagnostics/infrastructure/prisma-read-sql-repository";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

describe("PrismaReadSqlRepository", () => {
  it("audits only a hash and metadata, never the SQL text", async () => {
    const auditLog = { create: vi.fn() };
    const repository = new PrismaReadSqlRepository({ $queryRawUnsafe: vi.fn(), auditLog } as never);
    const sql = "SELECT passwordHash FROM \\\"User\\\" WHERE email = 'ana@example.com'";

    await repository.audit(sql, "admin-1", "request-1");

    expect(auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        metadataJson: expect.objectContaining({ statement: "SELECT", queryLength: sql.length }),
      }),
    });
    expect(JSON.stringify(auditLog.create.mock.calls)).not.toContain(sql);
  });
});
