import { describe, expect, it, vi } from "vitest";

import { GetPublicStandings } from "@/modules/standings/application/get-public-standings";

describe("GetPublicStandings", () => {
  it("returns the stored standings without recalculating them", async () => {
    const repository = { list: vi.fn().mockResolvedValue([]) };
    await expect(new GetPublicStandings(repository).execute()).resolves.toEqual([]);
    expect(repository.list).toHaveBeenCalledOnce();
  });
});
