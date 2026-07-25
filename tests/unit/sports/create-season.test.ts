import { describe, expect, it, vi } from "vitest";

import { CreateSeason, createSeasonSchema } from "@/modules/sports/application/create-season";
const input = createSeasonSchema.parse({
  name: "Apertura 2027",
  slug: "apertura-2027",
  startsAt: "2027-01-01",
  endsAt: "2027-05-01",
});
describe("CreateSeason", () => {
  it("creates a draft with the fixed v1 rules", async () => {
    const repository = { createDraft: vi.fn().mockResolvedValue("CREATED") };
    await new CreateSeason(repository).execute(
      { id: "admin", role: "ADMIN", status: "APPROVED" },
      input,
      new Date(),
    );
    expect(repository.createDraft).toHaveBeenCalledWith(
      expect.objectContaining({ exactPoints: 3, doubleMultiplier: 2 }),
    );
  });
  it("rejects regular users, duplicates and incoherent dates", async () => {
    const repository = { createDraft: vi.fn().mockResolvedValue("DUPLICATE") };
    await expect(
      new CreateSeason(repository).execute(
        { id: "u", role: "USER", status: "APPROVED" },
        input,
        new Date(),
      ),
    ).rejects.toThrow("FORBIDDEN");
    await expect(
      new CreateSeason(repository).execute(
        { id: "a", role: "ADMIN", status: "APPROVED" },
        input,
        new Date(),
      ),
    ).rejects.toThrow("DUPLICATE_SEASON");
    expect(() => createSeasonSchema.parse({ ...input, endsAt: new Date("2026-01-01") })).toThrow();
  });
});
