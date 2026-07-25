import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { sanitizeAuditJson } from "@/modules/audit/infrastructure/prisma-audit-log-repository";
import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

import { prisma } from "@/lib/prisma";
export default async function AuditPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ action?: string; entity?: string; requestId?: string }> }>) {
  const token = (await cookies()).get("session")?.value,
    session = token
      ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
      : null;
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN"))
    redirect("/login");
  const filters = await searchParams,
    logs = await prisma.auditLog.findMany({
      where: {
        action: filters.action as never,
        entityType: filters.entity as never,
        requestId: filters.requestId || undefined,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  return (
    <section className="w-full space-y-4">
      <h1 className="text-2xl font-bold">Auditoría</h1>
      <form className="flex gap-2">
        <input name="action" placeholder="Acción" />
        <input name="entity" placeholder="Entidad" />
        <input name="requestId" placeholder="Request ID" />
        <button>Filtrar</button>
      </form>
      {logs.map((log) => (
        <details key={log.id} className="rounded bg-white p-3 shadow">
          <summary>
            {log.action} · {log.entityType} · {log.createdAt.toLocaleString("es-HN")}
          </summary>
          <p>Request ID: {log.requestId ?? "—"}</p>
          <pre>
            {JSON.stringify(
              {
                before: sanitizeAuditJson(log.beforeJson as never),
                after: sanitizeAuditJson(log.afterJson as never),
                metadata: sanitizeAuditJson(log.metadataJson as never),
              },
              null,
              2,
            )}
          </pre>
        </details>
      ))}
    </section>
  );
}
