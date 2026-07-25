export type DiagnosticErrorView = Readonly<{
  id: string;
  diagnosticType: string;
  message: string;
  occurredAt: Date;
  requestId: string | null;
}>;

export interface DiagnosticErrorViewRepository {
  listFailures(page: number, pageSize: number): Promise<readonly DiagnosticErrorView[]>;
}

export class DiagnosticErrorViewer {
  public constructor(private readonly repository: DiagnosticErrorViewRepository) {}

  list(page = 1, pageSize = 20): Promise<readonly DiagnosticErrorView[]> {
    return this.repository.listFailures(normalizePage(page), normalizePageSize(pageSize));
  }
}

export function redactDiagnosticError(message: string | null): string {
  if (!message) return "La ejecucion diagnostica fallo sin un mensaje disponible.";
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
