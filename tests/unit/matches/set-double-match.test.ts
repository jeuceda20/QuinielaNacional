import { describe, expect, it, vi } from "vitest";

import { SetDoubleMatch } from "@/modules/matches/application/set-double-match";
describe("SetDoubleMatch", () => {
  it("marks one match double", async () => {
    const r = { set: vi.fn().mockResolvedValue("SET") };
    await expect(
      new SetDoubleMatch(r).execute(
        { id: "a", role: "ADMIN", status: "APPROVED" },
        "m",
        new Date(),
      ),
    ).resolves.toBeUndefined();
  });
  it("rejects users and conflicts", async () => {
    const r = { set: vi.fn().mockResolvedValue("CONFLICT") };
    await expect(
      new SetDoubleMatch(r).execute({ id: "u", role: "USER", status: "APPROVED" }, "m", new Date()),
    ).rejects.toThrow("FORBIDDEN");
    await expect(
      new SetDoubleMatch(r).execute(
        { id: "a", role: "ADMIN", status: "APPROVED" },
        "m",
        new Date(),
      ),
    ).rejects.toThrow("CONFLICT");
  });
});
