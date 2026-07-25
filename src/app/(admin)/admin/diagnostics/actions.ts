"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import {
  AuthorizationAccountStatus,
  AuthorizationRole,
  canUseDiagnostics,
} from "@/modules/auth/domain/authorization-policies";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { DiagnosticRunHistory } from "@/modules/diagnostics/application/diagnostic-run-history";
import { RunIntegrityCheck } from "@/modules/diagnostics/application/integrity-checker";
import { createIntegrityRunSummary } from "@/modules/diagnostics/application/integrity-run-summary";
import { PrismaDiagnosticRunHistoryRepository } from "@/modules/diagnostics/infrastructure/prisma-diagnostic-run-history-repository";
import { PrismaIntegrityRepository } from "@/modules/diagnostics/infrastructure/prisma-integrity-repository";

import { env } from "@/lib/env/server";
import { prisma } from "@/lib/prisma";
import { createRequestContext } from "@/lib/request-context";

export async function runIntegrityCheckAction() {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;

  const actor = session && {
    role: session.user.role as AuthorizationRole,
    status: session.user.status as AuthorizationAccountStatus,
  };
  if (!actor || !canUseDiagnostics(actor, env.ENABLE_DIAGNOSTICS)) throw new Error("FORBIDDEN");

  const context = createRequestContext({ userId: session.user.id, role: session.user.role });
  const history = new DiagnosticRunHistory(new PrismaDiagnosticRunHistoryRepository());
  const runId = await history.start({
    type: "INTEGRITY_CHECK",
    executedById: session.user.id,
    requestId: context.requestId,
  });

  try {
    const result = await new RunIntegrityCheck(new PrismaIntegrityRepository()).execute();
    const summary = createIntegrityRunSummary(result);
    await history.succeed(runId, summary);
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        actorRole: "SUPER_ADMIN",
        action: "INTEGRITY_CHECK_EXECUTED",
        entityType: "SYSTEM",
        entityId: null,
        metadataJson: { runId, summary },
        requestId: context.requestId,
      },
    });
  } catch (error) {
    await history.fail(runId, error);
    throw new Error("No fue posible completar la verificacion de integridad.");
  } finally {
    revalidatePath("/admin/diagnostics");
  }
}
