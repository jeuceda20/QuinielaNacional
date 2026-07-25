import { describe, expect, it, vi } from "vitest";

import { GetPublicResults } from "@/modules/results/application/get-public-results";

describe("GetPublicResults", () => {
  it("returns only rows provided by the processed-results repository", async () => {
    const repository = { list: vi.fn().mockResolvedValue([]) };
    await expect(new GetPublicResults(repository).execute()).resolves.toEqual([]);
    expect(repository.list).toHaveBeenCalledOnce();
  });
});
