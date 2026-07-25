import { describe, expect, it, vi } from "vitest";

import { CancelMatch, cancelMatchSchema } from "@/modules/matches/application/cancel-match";
const i = cancelMatchSchema.parse({
  matchId: "11111111-1111-4111-8111-111111111111",
  reason: "Condiciones inseguras",
});
describe("CancelMatch", () => {
  it("cancels an allowed match", async () => {
    const r = { cancel: vi.fn().mockResolvedValue("CANCELLED") };
    await expect(
      new CancelMatch(r).execute({ id: "a", role: "ADMIN", status: "APPROVED" }, i, new Date()),
    ).resolves.toBeUndefined();
  });
  it("rejects users and processed matches", async () => {
    const r = { cancel: vi.fn().mockResolvedValue("INVALID_STATE") };
    await expect(
      new CancelMatch(r).execute({ id: "u", role: "USER", status: "APPROVED" }, i, new Date()),
    ).rejects.toThrow("FORBIDDEN");
    await expect(
      new CancelMatch(r).execute({ id: "a", role: "ADMIN", status: "APPROVED" }, i, new Date()),
    ).rejects.toThrow("INVALID_STATE");
  });
});
