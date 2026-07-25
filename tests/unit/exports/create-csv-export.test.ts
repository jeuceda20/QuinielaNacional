import { describe, expect, it } from "vitest";

import {
  createCsvExportArtifact,
  escapeCsvCell,
} from "@/modules/exports/application/create-csv-export";

describe("createCsvExportArtifact", () => {
  it("creates a checksum-backed CSV with stable columns", () => {
    const artifact = createCsvExportArtifact([
      { name: "A", points: 3 },
      { name: "B", active: true },
    ]);
    expect(artifact.columns).toEqual(["active", "name", "points"]);
    expect(artifact.rowCount).toBe(2);
    expect(artifact.checksum).toMatch(/^[a-f0-9]{64}$/);
  });

  it("neutralizes spreadsheet formulas and escapes CSV delimiters", () => {
    expect(escapeCsvCell('=HYPERLINK("https://example.test")')).toBe(
      `"'=HYPERLINK(""https://example.test"")"`,
    );
    expect(escapeCsvCell('A,"B"')).toBe('"A,""B"""');
    expect(escapeCsvCell("@command")).toBe('"\'@command"');
  });
});
