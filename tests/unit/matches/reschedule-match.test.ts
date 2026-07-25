import { describe, expect, it, vi } from "vitest";

import {
  RescheduleMatch,
  rescheduleMatchSchema,
} from "@/modules/matches/application/reschedule-match";
const i = rescheduleMatchSchema.parse({
  matchId: "11111111-1111-4111-8111-111111111111",
  scheduledAt: "2027-01-02T18:00:00Z",
  reason: "Cambio oficial",
});
describe("RescheduleMatch", () => {
  it("recalculates close time", async () => {
    const r = { reschedule: vi.fn().mockResolvedValue("RESCHEDULED") };
    await new RescheduleMatch(r).execute(
      { id: "a", role: "ADMIN", status: "APPROVED" },
      i,
      new Date("2027-01-01"),
    );
    expect(r.reschedule).toHaveBeenCalledWith(
      expect.objectContaining({ newClosesAt: new Date("2027-01-02T17:55:00Z") }),
    );
  });
  it("rejects past dates", async () => {
    await expect(
      new RescheduleMatch({ reschedule: vi.fn() }).execute(
        { id: "a", role: "ADMIN", status: "APPROVED" },
        i,
        new Date("2028-01-01"),
      ),
    ).rejects.toThrow("INVALID_SCHEDULE");
  });
});
