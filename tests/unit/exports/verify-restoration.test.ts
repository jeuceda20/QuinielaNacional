import { verifyRestoration } from "@/modules/exports/application/verify-restoration";
import { describe, expect, it } from "vitest";
const snapshot = {
  databaseUrl: "postgresql://test:test@localhost/quiniela_test",
  sourceCounts: { teams: 2, standings: 1 },
  restoredCounts: { teams: 2, standings: 1 },
  sourceStandings: [{ seasonId: "s", userId: "u", totalPoints: 3, position: 1 }],
  restoredStandings: [{ seasonId: "s", userId: "u", totalPoints: 3, position: 1 }],
  integrityValid: true,
};
describe("verifyRestoration", () => {
  it("accepts an equivalent restoration only in test database", () =>
    expect(() => verifyRestoration(snapshot)).not.toThrow());
  it("rejects production targets and mismatches", () => {
    expect(() => verifyRestoration({ ...snapshot, databaseUrl: "postgresql://x/x" })).toThrow(
      "_test",
    );
    expect(() => verifyRestoration({ ...snapshot, integrityValid: false })).toThrow("integridad");
  });
});
