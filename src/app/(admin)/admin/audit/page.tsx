import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { sanitizeAuditJson } from "@/modules/audit/infrastructure/prisma-audit-log-repository";
import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

import { prisma } from "@/lib/prisma";

export default async function AuditPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ action?: string; entity?: string; requestId?: string }> }>) {
  const token = (await cookies()).get("session")?.value;
  const session = token ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date()) : null;
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) redirect("/login");

  const filters = await searchParams;
  const logs = await prisma.auditLog.findMany({
    where: {
      action: filters.action as never,
      entityType: filters.entity as never,
      requestId: filters.requestId || undefined,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <section className="w-full space-y-6">
      <div className="rounded-3xl border border-yellow-400/20 bg-gray-900 p-5 shadow-xl shadow-black/20 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-300">Zona de control</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Auditoría</h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">Consulta las acciones administrativas recientes y su contexto. No se muestran secretos.</p>
      </div>

      <form className="grid gap-3 rounded-3xl border border-gray-800 bg-gray-900 p-4 sm:grid-cols-4 sm:items-end">
        <label className="grid gap-1.5 text-sm font-medium text-gray-300">
          Acción
          <input name="action" defaultValue={filters.action} placeholder="Ej. MATCH_CREATED" className="rounded-xl border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder:text-gray-600 focus:border-yellow-300 focus:outline-none" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-gray-300">
          Entidad
          <input name="entity" defaultValue={filters.entity} placeholder="Ej. MATCH" className="rounded-xl border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder:text-gray-600 focus:border-yellow-300 focus:outline-none" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-gray-300">
          Request ID
          <input name="requestId" defaultValue={filters.requestId} placeholder="Identificador opcional" className="rounded-xl border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder:text-gray-600 focus:border-yellow-300 focus:outline-none" />
        </label>
        <button className="rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-gray-950 transition hover:bg-yellow-300">Filtrar</button>
      </form>

      <div className="space-y-3">
        {logs.length ? logs.map((log) => (
          <details key={log.id} className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-gray-200">
            <summary className="cursor-pointer list-none font-medium text-white">
              <span className="text-yellow-300">{log.action}</span><span className="mx-2 text-gray-600">·</span><span>{log.entityType}</span><span className="mx-2 text-gray-600">·</span><time className="text-sm font-normal text-gray-400">{log.createdAt.toLocaleString("es-HN")}</time>
            </summary>
            <div className="mt-4 border-t border-gray-800 pt-4">
              <p className="text-sm text-gray-400">Request ID: <span className="font-mono text-gray-300">{log.requestId ?? "—"}</span></p>
              <pre className="mt-3 overflow-x-auto rounded-xl border border-gray-800 bg-gray-950 p-3 text-xs leading-5 text-cyan-100">{JSON.stringify({ before: sanitizeAuditJson(log.beforeJson as never), after: sanitizeAuditJson(log.afterJson as never), metadata: sanitizeAuditJson(log.metadataJson as never) }, null, 2)}</pre>
            </div>
          </details>
        )) : (
          <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900 p-8 text-center text-sm text-gray-400">No hay registros que coincidan con los filtros seleccionados.</div>
        )}
      </div>
    </section>
  );
}
