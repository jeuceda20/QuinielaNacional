import { describe, expect, it } from "vitest";

import { isSameOfficialResult } from "@/modules/results/domain/official-result-idempotency";

describe("official result idempotency", () => {
  it("accepts only the same official score", () => {
    expect(
      isSameOfficialResult({ homeGoals: 2, awayGoals: 1 }, { homeGoals: 2, awayGoals: 1 }),
    ).toBe(true);
    expect(
      isSameOfficialResult({ homeGoals: 2, awayGoals: 1 }, { homeGoals: 1, awayGoals: 2 }),
    ).toBe(false);
  });
});
