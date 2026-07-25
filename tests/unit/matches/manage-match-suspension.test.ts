import { describe, expect, it, vi } from "vitest";

import {
  ManageMatchSuspension,
  suspendMatchSchema,
} from "@/modules/matches/application/manage-match-suspension";
const i = suspendMatchSchema.parse({
  matchId: "11111111-1111-4111-8111-111111111111",
  reason: "Clima adverso",
});
describe("ManageMatchSuspension", () => {
  it("suspends then resumes without changing schedules", async () => {
    const r = { change: vi.fn().mockResolvedValue("CHANGED") };
    const s = new ManageMatchSuspension(r);
    await s.suspend({ id: "a", role: "ADMIN", status: "APPROVED" }, i, new Date());
    await s.resume({ id: "a", role: "ADMIN", status: "APPROVED" }, i.matchId, new Date());
    expect(r.change).toHaveBeenCalledWith(i.matchId, "SUSPENDED", "a", i.reason, expect.any(Date));
  });
  it("rejects users", async () => {
    await expect(
      new ManageMatchSuspension({ change: vi.fn() }).suspend(
        { id: "u", role: "USER", status: "APPROVED" },
        i,
        new Date(),
      ),
    ).rejects.toThrow("FORBIDDEN");
  });
});
