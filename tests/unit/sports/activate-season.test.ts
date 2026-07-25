import { describe, expect, it, vi } from "vitest";

import { ActivateSeason } from "@/modules/sports/application/activate-season";
describe("ActivateSeason", () => {
  it("activates a draft for an approved admin", async () => {
    const repo = { activate: vi.fn().mockResolvedValue("ACTIVATED") };
    await expect(
      new ActivateSeason(repo).execute(
        { id: "a", role: "ADMIN", status: "APPROVED" },
        "s",
        new Date(),
      ),
    ).resolves.toEqual({ alreadyActive: false });
  });
  it("rejects users and active-season conflicts", async () => {
    const repo = { activate: vi.fn().mockResolvedValue("ACTIVE_SEASON_ALREADY_EXISTS") };
    await expect(
      new ActivateSeason(repo).execute(
        { id: "u", role: "USER", status: "APPROVED" },
        "s",
        new Date(),
      ),
    ).rejects.toThrow("FORBIDDEN");
    await expect(
      new ActivateSeason(repo).execute(
        { id: "a", role: "ADMIN", status: "APPROVED" },
        "s",
        new Date(),
      ),
    ).rejects.toThrow("ACTIVE_SEASON_ALREADY_EXISTS");
  });
});
