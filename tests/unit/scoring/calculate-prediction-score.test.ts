import { describe, expect, it } from "vitest";

import {
  calculatePredictionScore,
  InvalidScoringRulesError,
  PredictionScoreType,
} from "@/modules/scoring/domain/calculate-prediction-score";
import { InvalidScoreError } from "@/modules/scoring/domain/get-match-outcome";

describe("calculatePredictionScore", () => {
  it("awards exact points before evaluating the match outcome", () => {
    expect(
      calculatePredictionScore({
        prediction: { homeGoals: 2, awayGoals: 1 },
        officialResult: { homeGoals: 2, awayGoals: 1 },
      }),
    ).toEqual({
      scoreType: PredictionScoreType.EXACT,
      basePoints: 3,
      multiplier: 1,
      awardedPoints: 3,
    });
  });

  it("treats a 0-0 prediction as an exact score instead of no prediction", () => {
    expect(
      calculatePredictionScore({
        prediction: { homeGoals: 0, awayGoals: 0 },
        officialResult: { homeGoals: 0, awayGoals: 0 },
      }).scoreType,
    ).toBe(PredictionScoreType.EXACT);
  });

  it("awards partial points for a matching non-exact outcome", () => {
    expect(
      calculatePredictionScore({
        prediction: { homeGoals: 3, awayGoals: 1 },
        officialResult: { homeGoals: 2, awayGoals: 0 },
      }),
    ).toMatchObject({
      scoreType: PredictionScoreType.PARTIAL,
      basePoints: 1,
      awardedPoints: 1,
    });
  });

  it("awards wrong-score points when outcomes differ", () => {
    expect(
      calculatePredictionScore({
        prediction: { homeGoals: 1, awayGoals: 0 },
        officialResult: { homeGoals: 0, awayGoals: 1 },
      }),
    ).toMatchObject({
      scoreType: PredictionScoreType.WRONG,
      basePoints: 0,
      awardedPoints: 0,
    });
  });

  it("returns no-prediction points without confusing them with a 0-0 score", () => {
    expect(
      calculatePredictionScore({
        prediction: null,
        officialResult: { homeGoals: 0, awayGoals: 0 },
      }),
    ).toEqual({
      scoreType: PredictionScoreType.NO_PREDICTION,
      basePoints: 0,
      multiplier: 1,
      awardedPoints: 0,
    });
  });

  it("applies the double-match multiplier after calculating base points", () => {
    expect(
      calculatePredictionScore({
        prediction: { homeGoals: 2, awayGoals: 1 },
        officialResult: { homeGoals: 2, awayGoals: 1 },
        isDoublePoints: true,
      }),
    ).toMatchObject({
      scoreType: PredictionScoreType.EXACT,
      basePoints: 3,
      multiplier: 2,
      awardedPoints: 6,
    });
  });

  it("uses the supplied historical scoring rules", () => {
    expect(
      calculatePredictionScore({
        prediction: { homeGoals: 1, awayGoals: 0 },
        officialResult: { homeGoals: 2, awayGoals: 1 },
        rules: {
          exactPoints: 5,
          partialPoints: 2,
          wrongPoints: 0,
          doubleMultiplier: 2,
        },
      }),
    ).toMatchObject({
      scoreType: PredictionScoreType.PARTIAL,
      basePoints: 2,
      awardedPoints: 2,
    });
  });

  it("rejects invalid scores and scoring rules", () => {
    expect(() =>
      calculatePredictionScore({
        prediction: { homeGoals: -1, awayGoals: 0 },
        officialResult: { homeGoals: 0, awayGoals: 0 },
      }),
    ).toThrow(InvalidScoreError);

    expect(() =>
      calculatePredictionScore({
        prediction: null,
        officialResult: { homeGoals: 0, awayGoals: 0 },
        rules: {
          exactPoints: 3,
          partialPoints: 1,
          wrongPoints: 0,
          doubleMultiplier: 3,
        },
      }),
    ).toThrow(InvalidScoringRulesError);
  });
});
