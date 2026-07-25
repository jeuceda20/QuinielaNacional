import { describe, expect, it, vi } from "vitest";

import { CreateMatch, createMatchSchema } from "@/modules/matches/application/create-match";
const i = createMatchSchema.parse({
  roundId: "11111111-1111-4111-8111-111111111111",
  homeTeamId: "22222222-2222-4222-8222-222222222222",
  awayTeamId: "33333333-3333-4333-8333-333333333333",
  scheduledAt: "2027-01-01T18:00:00Z",
});
describe("CreateMatch", () => {
  it("calculates closing five minutes before", async () => {
    const r = { create: vi.fn().mockResolvedValue("CREATED") };
    await new CreateMatch(r).execute({ id: "a", role: "ADMIN", status: "APPROVED" }, i, new Date());
    expect(r.create).toHaveBeenCalledWith(
      expect.objectContaining({ predictionClosesAt: new Date("2027-01-01T17:55:00Z") }),
    );
  });
  it("rejects equal teams and users", async () => {
    expect(() => createMatchSchema.parse({ ...i, awayTeamId: i.homeTeamId })).toThrow();
    await expect(
      new CreateMatch({ create: vi.fn() }).execute(
        { id: "u", role: "USER", status: "APPROVED" },
        i,
        new Date(),
      ),
    ).rejects.toThrow("FORBIDDEN");
  });
});
