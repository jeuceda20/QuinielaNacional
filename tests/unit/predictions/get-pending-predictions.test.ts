import { describe, expect, it, vi } from "vitest";

import { GetPendingPredictions } from "@/modules/predictions/application/get-pending-predictions";
describe("GetPendingPredictions", () => {
  it("uses the current user and server time", async () => {
    const r = { list: vi.fn().mockResolvedValue([]) };
    await expect(
      new GetPendingPredictions(r).execute("u", new Date("2027-01-01")),
    ).resolves.toEqual([]);
    expect(r.list).toHaveBeenCalledWith("u", new Date("2027-01-01"));
  });
});
