import { describe, expect, it, vi } from "vitest";

import { AddSeasonParticipant } from "@/modules/sports/application/add-season-participant";
describe("AddSeasonParticipant", () => {
  it("adds an approved participant at zero", async () => {
    const repo = { add: vi.fn().mockResolvedValue("ADDED") };
    await expect(
      new AddSeasonParticipant(repo).execute(
        { id: "a", role: "ADMIN", status: "APPROVED" },
        "s",
        "u",
        new Date(),
      ),
    ).resolves.toBeUndefined();
  });
  it("rejects unapproved actors and duplicates", async () => {
    const repo = { add: vi.fn().mockResolvedValue("DUPLICATE") };
    await expect(
      new AddSeasonParticipant(repo).execute(
        { id: "a", role: "USER", status: "APPROVED" },
        "s",
        "u",
        new Date(),
      ),
    ).rejects.toThrow("FORBIDDEN");
    await expect(
      new AddSeasonParticipant(repo).execute(
        { id: "a", role: "ADMIN", status: "APPROVED" },
        "s",
        "u",
        new Date(),
      ),
    ).rejects.toThrow("DUPLICATE");
  });
});
