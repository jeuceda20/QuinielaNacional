import {
  SQL_ROW_LIMIT,
  executeReadSql,
  validateReadOnlySql,
} from "@/modules/diagnostics/application/read-sql-console";
import { describe, expect, it, vi } from "vitest";
describe("validateReadOnlySql", () => {
  it("limits SELECT queries", () =>
    expect(validateReadOnlySql('SELECT id FROM "User";')).toBe(
      `SELECT id FROM "User" LIMIT ${SQL_ROW_LIMIT}`,
    ));
  it("rejects writes and multiple statements", () => {
    expect(() => validateReadOnlySql('DELETE FROM "User"')).toThrow();
    expect(() => validateReadOnlySql("SELECT 1; SELECT 2")).toThrow();
  });
  it("executes bounded reads and audits them", async () => {
    const repository = { query: vi.fn().mockResolvedValue([{ connected: 1 }]), audit: vi.fn() };
    await expect(executeReadSql(repository, "SELECT 1", "admin-1", "request-1")).resolves.toEqual([
      { connected: 1 },
    ]);
    expect(repository.query).toHaveBeenCalledWith(`SELECT 1 LIMIT ${SQL_ROW_LIMIT}`, 5000);
    expect(repository.audit).toHaveBeenCalled();
  });
});
