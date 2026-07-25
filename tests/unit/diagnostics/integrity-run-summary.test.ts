import { describe, expect, it } from "vitest";

import { createIntegrityRunSummary } from "@/modules/diagnostics/application/integrity-run-summary";

describe("createIntegrityRunSummary", () => {
  it("keeps only safe aggregate data for the execution history", () => {
    expect(
      createIntegrityRunSummary({
        isValid: false,
        findings: [
          { code: "RESULTS", isValid: false, affectedRecords: 2, message: "Detalle interno" },
          { code: "POINTS", isValid: true, affectedRecords: 0, message: "Detalle interno" },
        ],
      }),
    ).toEqual({
      isValid: false,
      failedChecks: 1,
      findings: [
        { code: "RESULTS", isValid: false, affectedRecords: 2 },
        { code: "POINTS", isValid: true, affectedRecords: 0 },
      ],
    });
  });
});
