import { describe, expect, it, vi } from "vitest";

import { sanitizeAuditJson } from "@/modules/audit/infrastructure/prisma-audit-log-repository";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

describe("sanitizeAuditJson", () => {
  it("removes sensitive fields recursively while retaining safe audit context", () => {
    expect(
      sanitizeAuditJson({
        status: "APPROVED",
        passwordHash: "never-store-this",
        connection: "postgresql://user:password@database.example/app",
        nested: { accessToken: "never-store-this", nickname: "ana" },
        entries: [{ cookieValue: "never-store-this", action: "LOGIN" }],
      }),
    ).toEqual({
      status: "APPROVED",
      connection: "postgresql://[REDACTED]@database.example/app",
      nested: { nickname: "ana" },
      entries: [{ action: "LOGIN" }],
    });
  });
});
