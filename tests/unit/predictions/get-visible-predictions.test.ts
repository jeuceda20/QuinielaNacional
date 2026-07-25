import { describe, expect, it, vi } from "vitest";

import { GetVisiblePredictions } from "@/modules/predictions/application/get-visible-predictions";
describe("GetVisiblePredictions", () => {
  it("queries only own prediction before close", async () => {
    const r = {
      getClosesAt: vi.fn().mockResolvedValue(new Date("2027-01-02")),
      getOwn: vi.fn().mockResolvedValue([]),
      getAfterClose: vi.fn(),
    };
    await new GetVisiblePredictions(r).execute("u", "m", new Date("2027-01-01"));
    expect(r.getOwn).toHaveBeenCalledWith("m", "u");
    expect(r.getAfterClose).not.toHaveBeenCalled();
  });
  it("queries allowed predictions after close", async () => {
    const r = {
      getClosesAt: vi.fn().mockResolvedValue(new Date("2027-01-01")),
      getOwn: vi.fn(),
      getAfterClose: vi.fn().mockResolvedValue([]),
    };
    await new GetVisiblePredictions(r).execute("u", "m", new Date("2027-01-02"));
    expect(r.getAfterClose).toHaveBeenCalledWith("m");
  });
});
