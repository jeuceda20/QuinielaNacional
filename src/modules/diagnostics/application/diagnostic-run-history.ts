import type { AuditJson } from "@/modules/audit/domain/audit-log-repository";

export type DiagnosticRunStatus = "RUNNING" | "SUCCEEDED" | "FAILED";

export type DiagnosticRunHistoryItem = Readonly<{
  id: string;
  type: string;
  status: DiagnosticRunStatus;
  executedById: string | null;
  requestId: string | null;
  summary: AuditJson | null;
  sanitizedError: string | null;
  startedAt: Date;
  completedAt: Date | null;
}>;

export type StartDiagnosticRunInput = Readonly<{
  type: string;
  executedById?: string | null;
  requestId?: string | null;
  startedAt: Date;
}>;

export interface DiagnosticRunHistoryRepository {
  start(input: StartDiagnosticRunInput): Promise<string>;
  succeed(id: string, summary: AuditJson, completedAt: Date): Promise<void>;
  fail(id: string, sanitizedError: string, completedAt: Date): Promise<void>;
  list(page: number, pageSize: number): Promise<readonly DiagnosticRunHistoryItem[]>;
}

export class DiagnosticRunHistory {
  public constructor(
    private readonly repository: DiagnosticRunHistoryRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async start(input: Omit<StartDiagnosticRunInput, "startedAt">): Promise<string> {
    return this.repository.start({ ...input, startedAt: this.now() });
  }

  async succeed(id: string, summary: AuditJson): Promise<void> {
    await this.repository.succeed(id, summary, this.now());
  }

  async fail(id: string, error: unknown): Promise<void> {
    await this.repository.fail(id, sanitizeDiagnosticError(error), this.now());
  }

  list(page = 1, pageSize = 20): Promise<readonly DiagnosticRunHistoryItem[]> {
    return this.repository.list(normalizePage(page), normalizePageSize(pageSize));
  }
}

export function sanitizeDiagnosticError(error: unknown): string {
  const message = error instanceof Error ? error.message : "La ejecucion diagnostica fallo.";
  return message
    .replace(
      /(password|token|secret|authorization)\s*[=:]\s*(?:Bearer\s+)?[^\s,;]+/gi,
      "$1=[REDACTED]",
    )
    .slice(0, 1000);
}

function normalizePage(page: number): number {
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function normalizePageSize(pageSize: number): number {
  return Number.isInteger(pageSize) && pageSize > 0 ? Math.min(pageSize, 100) : 20;
}
