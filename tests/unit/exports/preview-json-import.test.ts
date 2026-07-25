import { describe, expect, it } from "vitest";

import { createJsonExportArtifact } from "@/modules/exports/application/create-json-export";
import { previewJsonImport } from "@/modules/exports/application/preview-json-import";
describe("previewJsonImport", () => {
  it("previews a compatible export without writes", () => {
    const json = createJsonExportArtifact(
      { teams: [{ id: "t" }], standings: [] },
      new Date(),
    ).content;
    expect(previewJsonImport(json)).toEqual({
      valid: true,
      counts: { teams: 1, standings: 0 },
      errors: [],
    });
  });
  it("reports malformed or incompatible files", () => {
    expect(previewJsonImport("no").valid).toBe(false);
    expect(
      previewJsonImport(JSON.stringify({ format: "other", version: 2, data: {} })).errors,
    ).toHaveLength(2);
  });
});
