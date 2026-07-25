import { describe, expect, it, vi } from "vitest";

import {
  DiagnosticErrorViewer,
  type DiagnosticErrorViewRepository,
  redactDiagnosticError,
} from "@/modules/diagnostics/application/error-viewer";

describe("DiagnosticErrorViewer", () => {
  it("lists failed executions using bounded pagination", async () => {
    const repository: DiagnosticErrorViewRepository = {
      listFailures: vi.fn().mockResolvedValue([]),
    };

    await new DiagnosticErrorViewer(repository).list(-1, 1000);

    expect(repository.listFailures).toHaveBeenCalledWith(1, 100);
  });

  it("redacts sensitive fragments and never exposes an absent internal error", () => {
    expect(redactDiagnosticError("authorization: Bearer abc123 fallo")).toBe(
      "authorization=[REDACTED] fallo",
    );
    expect(redactDiagnosticError(null)).toBe(
      "La ejecucion diagnostica fallo sin un mensaje disponible.",
    );
    expect(redactDiagnosticError("postgresql://user:password@db.example/app")).toBe(
      "postgresql://[REDACTED]@db.example/app",
    );
  });
});
