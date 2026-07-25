import { describe, expect, it, vi } from "vitest";

import {
  processMatchResultSchema,
  ProcessMatchResultService,
} from "@/modules/results/application/process-match-result";

import { createRequestContext } from "@/lib/request-context";

const input = processMatchResultSchema.parse({
  matchId: "11111111-1111-4111-8111-111111111111",
  homeGoals: 2,
  awayGoals: 2,
});
const context = createRequestContext({ userId: "admin", role: "ADMIN", requestId: "request-1" });

describe("ProcessMatchResultService", () => {
  it("processes an official draw with the authenticated administrator", async () => {
    const repository = { process: vi.fn().mockResolvedValue("PROCESSED") };
    await expect(
      new ProcessMatchResultService(repository).execute(context, input, new Date()),
    ).resolves.toBeUndefined();
    expect(repository.process).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: "admin", homeGoals: 2, awayGoals: 2 }),
    );
  });

  it("rejects invalid actors and processing states", async () => {
    const repository = { process: vi.fn().mockResolvedValue("MATCH_ALREADY_PROCESSED") };
    await expect(
      new ProcessMatchResultService(repository).execute(createRequestContext(), input, new Date()),
    ).rejects.toThrow("UNAUTHENTICATED");
    await expect(
      new ProcessMatchResultService(repository).execute(
        createRequestContext({ userId: "user", role: "USER" }),
        input,
        new Date(),
      ),
    ).rejects.toThrow("FORBIDDEN");
    await expect(
      new ProcessMatchResultService(repository).execute(context, input, new Date()),
    ).rejects.toThrow("MATCH_ALREADY_PROCESSED");
  });

  it("reports a conflict while another administrator holds the match lock", async () => {
    const repository = { process: vi.fn().mockResolvedValue("CONCURRENT_PROCESSING") };

    await expect(
      new ProcessMatchResultService(repository).execute(context, input, new Date()),
    ).rejects.toThrow("CONCURRENT_PROCESSING");
  });

  it("rejects decimal and negative official results", () => {
    expect(() => processMatchResultSchema.parse({ ...input, homeGoals: 1.5 })).toThrow();
    expect(() => processMatchResultSchema.parse({ ...input, awayGoals: -1 })).toThrow();
  });
});
