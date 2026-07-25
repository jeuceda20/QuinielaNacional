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

  it("edits an existing prediction through the same save service", async () => {
    const repository = { save: vi.fn().mockResolvedValue("SAVED") };
    const service = new SavePredictionService(repository);
    const context = createRequestContext({ userId: "user-id", role: "USER" });
    await service.execute(context, { ...i, homeGoals: 2, awayGoals: 1 }, new Date());
    await service.execute(context, { ...i, homeGoals: 1, awayGoals: 2 }, new Date());
    expect(repository.save).toHaveBeenLastCalledWith(
      expect.objectContaining({ userId: "user-id", homeGoals: 1, awayGoals: 2 }),
    );
  });

  it("keeps the same behavior for idempotent and concurrent saves", async () => {
    const repository = { save: vi.fn().mockResolvedValue("SAVED") };
    const service = new SavePredictionService(repository);
    const context = createRequestContext({ userId: "user-id", role: "USER" });
    await Promise.all([
      service.execute(context, i, new Date()),
      service.execute(context, i, new Date()),
    ]);
    expect(repository.save).toHaveBeenCalledTimes(2);
  });
});
