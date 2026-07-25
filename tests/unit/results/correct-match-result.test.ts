import { describe, expect, it, vi } from "vitest";

import {
  correctMatchResultSchema,
  CorrectMatchResultService,
} from "@/modules/results/application/correct-match-result";

import { createRequestContext } from "@/lib/request-context";
const input = correctMatchResultSchema.parse({
  matchId: "11111111-1111-4111-8111-111111111111",
  homeGoals: 2,
  awayGoals: 1,
  reason: "Resultado oficial corregido",
  password: "secret",
});
describe("CorrectMatchResultService", () => {
  it("requires a super administrator and password reauthentication", async () => {
    const repo = {
        getPasswordHash: vi.fn().mockResolvedValue("hash"),
        correct: vi.fn().mockResolvedValue("CORRECTED"),
      },
      passwords = { hash: vi.fn(), verify: vi.fn().mockResolvedValue(true) };
    await expect(
      new CorrectMatchResultService(repo, passwords).execute(
        createRequestContext({ userId: "root", role: "SUPER_ADMIN" }),
        input,
        new Date(),
      ),
    ).resolves.toBeUndefined();
    await expect(
      new CorrectMatchResultService(repo, passwords).execute(
        createRequestContext({ userId: "admin", role: "ADMIN" }),
        input,
        new Date(),
      ),
    ).rejects.toThrow("FORBIDDEN");
    expect(repo.correct).toHaveBeenCalledWith(
      expect.objectContaining({ reason: input.reason, actorId: "root" }),
    );
  });

  it("rejects an invalid reauthentication password", async () => {
    const repository = {
      getPasswordHash: vi.fn().mockResolvedValue("hash"),
      correct: vi.fn(),
    };
    const passwords = { hash: vi.fn(), verify: vi.fn().mockResolvedValue(false) };

    await expect(
      new CorrectMatchResultService(repository, passwords).execute(
        createRequestContext({ userId: "root", role: "SUPER_ADMIN" }),
        input,
        new Date(),
      ),
    ).rejects.toThrow("REAUTHENTICATION_REQUIRED");
    expect(repository.correct).not.toHaveBeenCalled();
  });
});
