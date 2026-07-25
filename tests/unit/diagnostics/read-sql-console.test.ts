import {
  SQL_ROW_LIMIT,
  validateReadOnlySql,
} from "@/modules/diagnostics/application/read-sql-console";
import { describe, expect, it } from "vitest";
describe("validateReadOnlySql", () => {
  it("limits SELECT queries", () =>
    expect(validateReadOnlySql('SELECT id FROM "User";')).toBe(
      `SELECT id FROM "User" LIMIT ${SQL_ROW_LIMIT}`,
    ));
  it("rejects writes and multiple statements", () => {
    expect(() => validateReadOnlySql('DELETE FROM "User"')).toThrow();
    expect(() => validateReadOnlySql("SELECT 1; SELECT 2")).toThrow();
  });
});
