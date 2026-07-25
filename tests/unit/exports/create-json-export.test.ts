import { describe, expect, it } from "vitest";

import { createJsonExportArtifact } from "@/modules/exports/application/create-json-export";
describe("createJsonExportArtifact", () => {
  it("creates a versioned JSON payload with a checksum", () => {
    const artifact = createJsonExportArtifact(
      { teams: [{ id: "team-1" }], users: [] },
      new Date("2026-07-24T00:00:00.000Z"),
    );
    expect(artifact).toMatchObject({
      format: "quiniela-nacional-export",
      version: 1,
      rowCount: 1,
      checksum: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect(JSON.parse(artifact.content)).toEqual(
      expect.objectContaining({ format: "quiniela-nacional-export", version: 1 }),
    );
  });
});
