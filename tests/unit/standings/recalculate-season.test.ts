import { describe, expect, it, vi } from "vitest";

import { RecalculateSeasonService } from "@/modules/standings/application/recalculate-season";

import { createRequestContext } from "@/lib/request-context";
describe("RecalculateSeasonService", () => {
  it("requires super admin and returns a rebuild summary", async () => {
    const repository = {
      recalculate: vi.fn().mockResolvedValue({ matches: 2, scores: 4, standings: 2 }),
    };
    await expect(
      new RecalculateSeasonService(repository).execute(
        createRequestContext({ userId: "root", role: "SUPER_ADMIN" }),
        "season",
        new Date(),
      ),
    ).resolves.toEqual({ matches: 2, scores: 4, standings: 2 });
    await expect(
      new RecalculateSeasonService(repository).execute(
        createRequestContext({ userId: "admin", role: "ADMIN" }),
        "season",
        new Date(),
      ),
    ).rejects.toThrow("FORBIDDEN");
  });
});
