import type { AuditJson } from "@/modules/audit/domain/audit-log-repository";
import type {
  DiagnosticRunHistoryItem,
  DiagnosticRunHistoryRepository,
  StartDiagnosticRunInput,
} from "@/modules/diagnostics/application/diagnostic-run-history";

import { prisma } from "@/lib/prisma";

import { Prisma, type PrismaClient, RunStatus } from "@/generated/prisma/client";

export type DiagnosticRunHistoryDatabase = Pick<PrismaClient, "diagnosticRun">;

export class PrismaDiagnosticRunHistoryRepository implements DiagnosticRunHistoryRepository {
  public constructor(private readonly database: DiagnosticRunHistoryDatabase = prisma) {}

  async start(input: StartDiagnosticRunInput): Promise<string> {
    const run = await this.database.diagnosticRun.create({
      data: {
        type: input.type,
        status: RunStatus.RUNNING,
        executedById: input.executedById ?? null,
        requestId: input.requestId ?? null,
        startedAt: input.startedAt,
      },
      select: { id: true },
    });
    return run.id;
  }

  async succeed(id: string, summary: AuditJson, completedAt: Date): Promise<void> {
    await this.database.diagnosticRun.update({
      where: { id },
      data: {
        status: RunStatus.SUCCEEDED,
        summaryJson: summary as Prisma.InputJsonValue,
        sanitizedError: null,
        completedAt,
      },
    });
  }

  async fail(id: string, sanitizedError: string, completedAt: Date): Promise<void> {
    await this.database.diagnosticRun.update({
      where: { id },
      data: { status: RunStatus.FAILED, sanitizedError, completedAt },
    });
  }

  async list(page: number, pageSize: number): Promise<readonly DiagnosticRunHistoryItem[]> {
    const runs = await this.database.diagnosticRun.findMany({
      orderBy: { startedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        type: true,
        status: true,
        executedById: true,
        requestId: true,
        summaryJson: true,
        sanitizedError: true,
        startedAt: true,
        completedAt: true,
      },
    });

    return runs.map((run) => ({
      ...run,
      status: run.status as DiagnosticRunHistoryItem["status"],
      summary: run.summaryJson as AuditJson | null,
    }));
  }
}
