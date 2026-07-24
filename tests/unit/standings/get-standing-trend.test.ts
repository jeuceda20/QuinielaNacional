import { describe, expect, it } from "vitest";

import {
  getStandingTrend,
  InvalidStandingPositionError,
  StandingTrend,
} from "@/modules/standings/domain/get-standing-trend";

describe("getStandingTrend", () => {
  it("returns UP when the current position improves", () => {
    expect(getStandingTrend({ currentPosition: 1, previousPosition: 3 })).toBe(StandingTrend.UP);
  });

  it("returns DOWN when the current position worsens", () => {
    expect(getStandingTrend({ currentPosition: 4, previousPosition: 2 })).toBe(StandingTrend.DOWN);
  });

  it("returns SAME when positions are equal", () => {
    expect(getStandingTrend({ currentPosition: 2, previousPosition: 2 })).toBe(StandingTrend.SAME);
  });

  it("returns NEW when there is no previous snapshot", () => {
    expect(getStandingTrend({ currentPosition: 1 })).toBe(StandingTrend.NEW);
    expect(getStandingTrend({ currentPosition: 1, previousPosition: null })).toBe(
      StandingTrend.NEW,
    );
  });

  it.each([
    { currentPosition: 0, previousPosition: 1 },
    { currentPosition: 1.5, previousPosition: 1 },
    { currentPosition: 1, previousPosition: -1 },
    { currentPosition: 1, previousPosition: Number.NaN },
  ])("rejects invalid positions: %o", (input) => {
    expect(() => getStandingTrend(input)).toThrow(InvalidStandingPositionError);
  });
});
