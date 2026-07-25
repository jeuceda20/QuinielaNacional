import { describe, expect, it } from "vitest";

import { simulatePredictions } from "@/modules/testing/application/simulate-predictions";
describe("simulatePredictions", () => {
  it("calculates hypothetical points without persistence", () =>
    expect(
      simulatePredictions(
        [
          { userId: "a", currentPoints: 1, predictedHomeGoals: 2, predictedAwayGoals: 0 },
          { userId: "b", currentPoints: 2, predictedHomeGoals: 1, predictedAwayGoals: 0 },
        ],
        2,
        0,
      ),
    ).toEqual([
      { userId: "a", simulatedPoints: 4 },
      { userId: "b", simulatedPoints: 3 },
    ]));
});
