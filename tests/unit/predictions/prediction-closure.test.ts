import { describe, expect, it } from "vitest";

import {
  calculatePredictionClosesAt,
  canSubmitPrediction,
  canViewOtherPredictions,
  InvalidPredictionCloseTimeError,
} from "@/modules/predictions/domain/prediction-closure";

const scheduledAt = new Date("2026-08-15T01:00:00.000Z");
const predictionClosesAt = new Date("2026-08-15T00:55:00.000Z");

describe("prediction closure", () => {
  it("calculates the official five-minute prediction close time", () => {
    expect(calculatePredictionClosesAt(scheduledAt)).toEqual(predictionClosesAt);
  });

  it("supports a season-specific close-minute setting", () => {
    expect(calculatePredictionClosesAt(scheduledAt, 10)).toEqual(
      new Date("2026-08-15T00:50:00.000Z"),
    );
  });

  it("allows submissions one second before closure", () => {
    expect(
      canSubmitPrediction({
        serverNow: new Date("2026-08-15T00:54:59.000Z"),
        predictionClosesAt,
      }),
    ).toBe(true);
  });

  it("closes submissions exactly at the close time and afterwards", () => {
    expect(
      canSubmitPrediction({
        serverNow: predictionClosesAt,
        predictionClosesAt,
      }),
    ).toBe(false);
    expect(
      canSubmitPrediction({
        serverNow: new Date("2026-08-15T00:55:01.000Z"),
        predictionClosesAt,
      }),
    ).toBe(false);
  });

  it("reveals other predictions only after the prediction window closes", () => {
    expect(
      canViewOtherPredictions({
        serverNow: new Date("2026-08-15T00:54:59.000Z"),
        predictionClosesAt,
      }),
    ).toBe(false);
    expect(
      canViewOtherPredictions({
        serverNow: predictionClosesAt,
        predictionClosesAt,
      }),
    ).toBe(true);
  });

  it("rejects invalid dates and close-minute values", () => {
    expect(() => calculatePredictionClosesAt(new Date("invalid"))).toThrow(
      InvalidPredictionCloseTimeError,
    );
    expect(() => calculatePredictionClosesAt(scheduledAt, -1)).toThrow(
      InvalidPredictionCloseTimeError,
    );
    expect(() =>
      canSubmitPrediction({
        serverNow: new Date("invalid"),
        predictionClosesAt,
      }),
    ).toThrow(InvalidPredictionCloseTimeError);
  });
});
