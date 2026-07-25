import { createTestDataBatch } from "@/modules/testing/application/test-data-batch";
import { describe, expect, it } from "vitest";
describe("createTestDataBatch", () => {
  it("creates explicitly marked bounded test data", () => {
    expect(createTestDataBatch("batch-1", 2, 3)).toEqual(
      expect.objectContaining({
        batchId: "batch-1",
        predictionsPerUser: 3,
        users: [
          { nickname: "test-batch-1-1", isTestUser: true },
          { nickname: "test-batch-1-2", isTestUser: true },
        ],
      }),
    );
  });
  it("rejects unsafe batch sizes", () =>
    expect(() => createTestDataBatch("batch", 101, 0)).toThrow());
});
