import { rejectWriteSql } from "@/modules/diagnostics/application/write-sql-console";
import { describe, expect, it } from "vitest";
describe("write SQL console", () => {
  it("remains disabled", () => expect(rejectWriteSql).toThrow("deshabilitada"));
});
