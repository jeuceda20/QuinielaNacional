import { describe, expect, it } from "vitest";

import {
  getMatchOutcome,
  InvalidScoreError,
  MatchOutcome,
} from "@/modules/scoring/domain/get-match-outcome";

describe("getMatchOutcome", () => {
  it("returns HOME_WIN when the home team scores more goals", () => {
    expect(getMatchOutcome({ homeGoals: 2, awayGoals: 1 })).toBe(MatchOutcome.HOME_WIN);
  });

  it("returns DRAW for equal scores, including 0-0", () => {
    expect(getMatchOutcome({ homeGoals: 0, awayGoals: 0 })).toBe(MatchOutcome.DRAW);
    expect(getMatchOutcome({ homeGoals: 3, awayGoals: 3 })).toBe(MatchOutcome.DRAW);
  });

  it("returns AWAY_WIN when the away team scores more goals", () => {
    expect(getMatchOutcome({ homeGoals: 1, awayGoals: 2 })).toBe(MatchOutcome.AWAY_WIN);
  });

  it.each([
    { homeGoals: -1, awayGoals: 0 },
    { homeGoals: 0, awayGoals: -1 },
    { homeGoals: 1.5, awayGoals: 0 },
    { homeGoals: 0, awayGoals: Number.NaN },
    { homeGoals: Number.POSITIVE_INFINITY, awayGoals: 0 },
  ])("rejects invalid scores: %o", (score) => {
    expect(() => getMatchOutcome(score)).toThrow(InvalidScoreError);
  });
});
