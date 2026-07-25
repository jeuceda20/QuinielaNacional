import { describe, expect, it } from "vitest";

import {
  checkIntegrity,
  type IntegritySnapshot,
  RunIntegrityCheck,
} from "@/modules/diagnostics/application/integrity-checker";

const validSnapshot: IntegritySnapshot = {
  activeSeasons: 1,
  activeSuperAdmins: 1,
  roundsWithoutExactlyOneDouble: 0,
  duplicatePredictions: 0,
  standingsWithIncorrectPoints: 0,
  standingsWithoutEligibleParticipant: 0,
  processedMatchesWithoutCurrentResult: 0,
  cancelledMatchesWithCurrentResult: 0,
};

describe("checkIntegrity", () => {
  it("approves a consistent snapshot", () => {
    expect(checkIntegrity(validSnapshot)).toEqual({
      isValid: true,
      findings: expect.arrayContaining([
        expect.objectContaining({ code: "ACTIVE_SEASONS", isValid: true }),
        expect.objectContaining({ code: "CANCELLED_MATCHES", isValid: true }),
      ]),
    });
  });

  it("reports every failed minimum verification", async () => {
    const result = await new RunIntegrityCheck({
      getSnapshot: async () => ({
        activeSeasons: 2,
        activeSuperAdmins: 0,
        roundsWithoutExactlyOneDouble: 2,
        duplicatePredictions: 3,
        standingsWithIncorrectPoints: 4,
        standingsWithoutEligibleParticipant: 5,
        processedMatchesWithoutCurrentResult: 6,
        cancelledMatchesWithCurrentResult: 7,
      }),
    }).execute();

    expect(result.isValid).toBe(false);
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "ACTIVE_SEASONS", affectedRecords: 1, isValid: false }),
        expect.objectContaining({ code: "SUPER_ADMINS", affectedRecords: 1, isValid: false }),
        expect.objectContaining({ code: "DOUBLE_MATCHES", affectedRecords: 2, isValid: false }),
        expect.objectContaining({
          code: "DUPLICATE_PREDICTIONS",
          affectedRecords: 3,
          isValid: false,
        }),
        expect.objectContaining({ code: "POINTS", affectedRecords: 4, isValid: false }),
        expect.objectContaining({ code: "STANDINGS", affectedRecords: 5, isValid: false }),
        expect.objectContaining({ code: "RESULTS", affectedRecords: 6, isValid: false }),
        expect.objectContaining({ code: "CANCELLED_MATCHES", affectedRecords: 7, isValid: false }),
      ]),
    );
  });
});
