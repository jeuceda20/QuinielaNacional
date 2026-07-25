import { describe, expect, it } from "vitest";

import { previewRecalculation } from "@/modules/standings/application/preview-recalculation";

describe("previewRecalculation", () => {
  it("compares current standings to a recalculated read-only result", () => {
    expect(
      previewRecalculation(
        [
          {
            userId: "a",
            nickname: "Ana",
            totalPoints: 3,
            exactCount: 1,
            partialCount: 0,
            position: 1,
          },
        ],
        [
          { userId: "a", nickname: "Ana", totalPoints: 1, exactCount: 0, partialCount: 1 },
          { userId: "b", nickname: "Beto", totalPoints: 3, exactCount: 1, partialCount: 0 },
        ],
      ),
    ).toEqual([
      {
        userId: "b",
        nickname: "Beto",
        currentPoints: 0,
        recalculatedPoints: 3,
        pointsDifference: 3,
        currentPosition: null,
        recalculatedPosition: 1,
      },
      {
        userId: "a",
        nickname: "Ana",
        currentPoints: 3,
        recalculatedPoints: 1,
        pointsDifference: -2,
        currentPosition: 1,
        recalculatedPosition: 2,
      },
    ]);
  });
});
