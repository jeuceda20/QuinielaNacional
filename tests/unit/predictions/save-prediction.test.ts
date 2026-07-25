import { describe, expect, it, vi } from "vitest";

import {
  savePredictionSchema,
  SavePredictionService,
} from "@/modules/predictions/application/save-prediction";

import { createRequestContext } from "@/lib/request-context";
const i = savePredictionSchema.parse({
  matchId: "11111111-1111-4111-8111-111111111111",
  homeGoals: 0,
  awayGoals: 0,
});
describe("SavePredictionService", () => {
  it("saves 0-0 using context user", async () => {
    const r = { save: vi.fn().mockResolvedValue("SAVED") };
    await new SavePredictionService(r).execute(
      createRequestContext({ userId: "u", role: "USER" }),
      i,
      new Date(),
    );
    expect(r.save).toHaveBeenCalledWith(expect.objectContaining({ userId: "u", homeGoals: 0 }));
  });
  it("rejects unauthenticated and closed", async () => {
    const r = { save: vi.fn().mockResolvedValue("MATCH_CLOSED") };
    await expect(
      new SavePredictionService(r).execute(createRequestContext(), i, new Date()),
    ).rejects.toThrow("UNAUTHENTICATED");
    await expect(
      new SavePredictionService(r).execute(createRequestContext({ userId: "u" }), i, new Date()),
    ).rejects.toThrow("MATCH_CLOSED");
  });
});
