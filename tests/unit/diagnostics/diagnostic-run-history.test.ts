import { describe, expect, it, vi } from "vitest";

import {
  DiagnosticRunHistory,
  type DiagnosticRunHistoryRepository,
  sanitizeDiagnosticError,
} from "@/modules/diagnostics/application/diagnostic-run-history";

describe("DiagnosticRunHistory", () => {
  it("records lifecycle timestamps and bounds pagination", async () => {
    const repository: DiagnosticRunHistoryRepository = {
      start: vi.fn().mockResolvedValue("run-1"),
      succeed: vi.fn(),
      fail: vi.fn(),
      list: vi.fn().mockResolvedValue([]),
    };
    const now = new Date("2026-07-24T12:00:00.000Z");
    const history = new DiagnosticRunHistory(repository, () => now);

    await expect(history.start({ type: "INTEGRITY_CHECK", executedById: "user-1" })).resolves.toBe(
      "run-1",
    );
    await history.succeed("run-1", { valid: true });
    await history.list(0, 200);

    expect(repository.start).toHaveBeenCalledWith({
      type: "INTEGRITY_CHECK",
      executedById: "user-1",
      startedAt: now,
    });
    expect(repository.succeed).toHaveBeenCalledWith("run-1", { valid: true }, now);
    expect(repository.list).toHaveBeenCalledWith(1, 100);
  });

  it("stores only a redacted and bounded error message", async () => {
    const repository: DiagnosticRunHistoryRepository = {
      start: vi.fn(),
      succeed: vi.fn(),
      fail: vi.fn(),
      list: vi.fn(),
    };
    const history = new DiagnosticRunHistory(
      repository,
      () => new Date("2026-07-24T12:00:00.000Z"),
    );

    await history.fail(
      "run-1",
      new Error("authorization: Bearer secret-value no pudo verificarse"),
    );

    expect(repository.fail).toHaveBeenCalledWith(
      "run-1",
      "authorization=[REDACTED] no pudo verificarse",
      new Date("2026-07-24T12:00:00.000Z"),
    );
    expect(sanitizeDiagnosticError("raw")).toBe("La ejecucion diagnostica fallo.");
  });
});
