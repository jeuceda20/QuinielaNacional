import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

import { prisma } from "@/lib/prisma";

const exportOptions = [
  { href: "/api/v1/admin/exports/backup-json", title: "Respaldo completo JSON", description: "Datos deportivos y configuración pública, con checksum de integridad.", format: "JSON" },
  { href: "/api/v1/admin/exports/users", title: "Usuarios", description: "Cuentas, estado, rol y equipo favorito.", format: "CSV" },
  { href: "/api/v1/admin/exports/matches", title: "Partidos", description: "Temporadas, jornadas, horarios, estado y resultado oficial.", format: "CSV" },
  { href: "/api/v1/admin/exports/predictions", title: "Pronósticos", description: "Pronósticos registrados y su puntuación asignada.", format: "CSV" },
  { href: "/api/v1/admin/exports/standings", title: "Tabla de posiciones", description: "Posiciones, puntos, exactos, parciales y bonus PJx2.", format: "CSV" },
] as const;

export default async function ExportsPage() {
  const token = (await cookies()).get("session")?.value;
  const session = token ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date()) : null;
  if (!session || session.user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const history = await prisma.exportRun.findMany({ orderBy: { startedAt: "desc" }, take: 12, include: { requestedBy: { select: { nickname: true } } } });

  return (
    <section className="w-full space-y-6">
      <div className="rounded-3xl border border-yellow-400/20 bg-gray-900 p-5 shadow-xl shadow-black/20 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-300">Respaldo y control</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Exportaciones</h2>
        <p className="mt-2 max-w-3xl text-sm text-gray-400">Genera archivos descargables para respaldo o análisis. Cada generación queda registrada en Auditoría; los archivos no incluyen contraseñas ni secretos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exportOptions.map((item) => (
          <article key={item.href} className="flex min-h-48 flex-col rounded-3xl border border-gray-800 bg-gray-900 p-5">
            <span className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-200">{item.format}</span>
            <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-gray-400">{item.description}</p>
            <a href={item.href} className="mt-5 rounded-xl bg-yellow-400 px-4 py-2 text-center text-sm font-semibold text-gray-950 transition hover:bg-yellow-300">Descargar</a>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-5 sm:p-6">
        <h3 className="font-semibold text-white">Historial reciente</h3>
        <p className="mt-1 text-sm text-gray-400">Se conservan los datos de cada generación, no una copia del archivo en el servidor.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-800 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-3 py-3">Archivo</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3">Filas</th><th className="px-3 py-3">Solicitado por</th><th className="px-3 py-3">Fecha</th></tr></thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {history.length ? history.map((run) => <tr key={run.id}><td className="px-3 py-3 font-medium text-white">{run.exportType} <span className="text-gray-500">· {run.format.toUpperCase()}</span></td><td className="px-3 py-3"><span className={run.status === "SUCCEEDED" ? "text-emerald-300" : run.status === "FAILED" ? "text-red-300" : "text-yellow-200"}>{run.status}</span></td><td className="px-3 py-3">{run.rowCount ?? "—"}</td><td className="px-3 py-3">{run.requestedBy?.nickname ?? "Sistema"}</td><td className="px-3 py-3 text-gray-400">{run.startedAt.toLocaleString("es-HN")}</td></tr>) : <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">Aún no se han generado exportaciones.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
