import { describe, expect, it, vi } from "vitest";

import { GetSystemStatus } from "@/modules/diagnostics/application/get-system-status";
describe("GetSystemStatus", () => {
  it("reports safe health metadata without secrets", async () => {
    const result = await new GetSystemStatus(
      { checkDatabase: vi.fn().mockResolvedValue(true) },
      { version: "0.1.0", environment: "test", diagnosticsEnabled: false },
    ).execute();
    expect(result).toEqual(
      expect.objectContaining({ application: "UP", database: "UP" }),
    );
  });
});
