import type { NextRequest } from "next/server";

import { z } from "zod";

import { sanitizeAuditJson } from "@/modules/audit/infrastructure/prisma-audit-log-repository";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getApiSession, hasApiRole } from "@/lib/api/session";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  if (!hasApiRole(session, ["ADMIN", "SUPER_ADMIN"]))
    return apiError(403, "FORBIDDEN", "No tienes permisos para consultar la auditoría.");
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success)
    return apiError(400, "VALIDATION_ERROR", "Revisa los datos enviados.", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  const { page, pageSize } = parsed.data;
  const [logs, totalItems] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count(),
  ]);
  return apiSuccess(
    logs.map((log) => ({
      id: log.id,
      actorUserId: log.actorUserId,
      actorRole: log.actorRole,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      before: sanitizeAuditJson(log.beforeJson as never),
      after: sanitizeAuditJson(log.afterJson as never),
      metadata: sanitizeAuditJson(log.metadataJson as never),
      createdAt: log.createdAt.toISOString(),
      requestId: log.requestId,
    })),
    200,
    {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      hasNextPage: page * pageSize < totalItems,
      hasPreviousPage: page > 1,
    },
  );
}
