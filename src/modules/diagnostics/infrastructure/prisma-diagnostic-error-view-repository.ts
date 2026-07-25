import type {
  DiagnosticErrorView,
  DiagnosticErrorViewRepository,
} from "@/modules/diagnostics/application/error-viewer";
import { redactDiagnosticError } from "@/modules/diagnostics/application/error-viewer";

import { prisma } from "@/lib/prisma";

import { type PrismaClient, RunStatus } from "@/generated/prisma/client";

export type DiagnosticErrorViewDatabase = Pick<PrismaClient, "diagnosticRun">;

export class PrismaDiagnosticErrorViewRepository implements DiagnosticErrorViewRepository {
  public constructor(private readonly database: DiagnosticErrorViewDatabase = prisma) {}

  async listFailures(page: number, pageSize: number): Promise<readonly DiagnosticErrorView[]> {
    const runs = await this.database.diagnosticRun.findMany({
      where: { status: RunStatus.FAILED },
      orderBy: { completedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        type: true,
        sanitizedError: true,
        startedAt: true,
        completedAt: true,
        requestId: true,
      },
    });

    return runs.map((run) => ({
      id: run.id,
      diagnosticType: run.type,
      message: redactDiagnosticError(run.sanitizedError),
      occurredAt: run.completedAt ?? run.startedAt,
      requestId: run.requestId,
    }));
  }
}
