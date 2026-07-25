import { describe, expect, it, vi } from "vitest";

import { ManageRound, roundSchema } from "@/modules/sports/application/manage-round";
const input = roundSchema.parse({
  seasonId: "11111111-1111-4111-8111-111111111111",
  name: "Clásicos pendientes",
  slug: "clasicos-pendientes",
  sequence: 2,
});
describe("ManageRound", () => {
  it("creates drafts and publishes them without deriving chronology", async () => {
    const r = {
      create: vi.fn().mockResolvedValue("CREATED"),
      update: vi.fn(),
      setStatus: vi.fn().mockResolvedValue(true),
    };
    const s = new ManageRound(r);
    await s.create({ id: "a", role: "ADMIN", status: "APPROVED" }, input, new Date());
    await s.publish({ id: "a", role: "ADMIN", status: "APPROVED" }, "r", new Date());
  });
  it("rejects users", async () => {
    const r = { create: vi.fn(), update: vi.fn(), setStatus: vi.fn() };
    await expect(
      new ManageRound(r).create({ id: "u", role: "USER", status: "APPROVED" }, input, new Date()),
    ).rejects.toThrow("FORBIDDEN");
  });
});
