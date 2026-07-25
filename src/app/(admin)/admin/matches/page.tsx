import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { ProcessResultForm } from "@/modules/results/ui/process-result-form";

import { prisma } from "@/lib/prisma";

import { matchAction } from "./actions";
export default async function MatchesPage() {
  const t = (await cookies()).get("session")?.value,
    s = t ? await new SessionService(new PrismaSessionRepository()).validate(t, new Date()) : null;
  if (!s || (s.user.role !== "ADMIN" && s.user.role !== "SUPER_ADMIN")) redirect("/login");
  const matches = await prisma.match.findMany({
    where: { archivedAt: null },
    orderBy: { scheduledAt: "asc" },
    include: {
      round: { select: { name: true } },
      homeTeam: { select: { name: true } },
      awayTeam: { select: { name: true } },
      _count: { select: { predictions: true } },
    },
  });
  const [teams, rounds] = await Promise.all([
    prisma.team.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.round.findMany({ where: { archivedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <section className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partidos</h1>
        <p className="text-sm text-slate-600">
          Orden cronológico por fecha oficial. Los resultados se gestionan en otra fase.
        </p>
      </div>
      <form action={matchAction} className="grid gap-2 rounded bg-white p-4 shadow sm:grid-cols-5">
        <input type="hidden" name="action" value="create" />
        <select name="roundId" required className="rounded border p-2">
          <option value="">Jornada</option>
          {rounds.map((round) => (
            <option key={round.id} value={round.id}>
              {round.name}
            </option>
          ))}
        </select>
        <select name="homeTeamId" required className="rounded border p-2">
          <option value="">Local</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <select name="awayTeamId" required className="rounded border p-2">
          <option value="">Visitante</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <input name="scheduledAt" type="datetime-local" required className="rounded border p-2" />
        <button className="rounded bg-blue-700 p-2 font-semibold text-white">Crear partido</button>
      </form>
      <div className="overflow-x-auto rounded bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              {[
                "Fecha",
                "Jornada",
                "Local",
                "Visitante",
                "Estado",
                "Cierre",
                "Doble",
                "Pronósticos",
                "Procesar",
                "Detalle",
              ].map((x) => (
                <th key={x} className="px-3 py-3">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="px-3 py-3">{m.scheduledAt.toLocaleString("es-HN")}</td>
                <td className="px-3 py-3">{m.round.name}</td>
                <td className="px-3 py-3">{m.homeTeam.name}</td>
                <td className="px-3 py-3">{m.awayTeam.name}</td>
                <td className="px-3 py-3">{m.status}</td>
                <td className="px-3 py-3">{m.predictionClosesAt.toLocaleString("es-HN")}</td>
                <td className="px-3 py-3">{m.isDoublePoints ? "Sí" : "No"}</td>
                <td className="px-3 py-3">{m._count.predictions}</td>
                <td className="px-3 py-3">
                  {m.status === "FINISHED_PENDING" ? <ProcessResultForm matchId={m.id} /> : "—"}
                </td>
                <td className="px-3 py-3">
                  <details>
                    <summary className="cursor-pointer text-blue-700">Ver detalle</summary>
                    <p>ID: {m.id}</p>
                    <p>Estado deportivo: {m.status}</p>
                    <p>No hay resultado oficial en esta pantalla.</p>
                    <form action={matchAction} className="mt-2 grid gap-1">
                      <input type="hidden" name="matchId" value={m.id} />
                      <input name="reason" placeholder="Motivo" className="rounded border p-1" />
                      <input
                        name="scheduledAt"
                        type="datetime-local"
                        aria-label={`Nueva fecha para ${m.homeTeam.name}`}
                        className="rounded border p-1"
                      />
                      <button name="action" value="reschedule" className="text-left text-blue-700">
                        Reprogramar
                      </button>
                      {!m.isDoublePoints && (
                        <button name="action" value="double" className="text-left text-blue-700">
                          Designar doble
                        </button>
                      )}
                      {["SCHEDULED", "RESCHEDULED", "CLOSED"].includes(m.status) && (
                        <button name="action" value="suspend" className="text-left text-amber-700">
                          Suspender
                        </button>
                      )}
                      {m.status === "SUSPENDED" && (
                        <button name="action" value="resume" className="text-left text-blue-700">
                          Reanudar
                        </button>
                      )}
                      {!["PROCESSED", "CANCELLED"].includes(m.status) && (
                        <button name="action" value="cancel" className="text-left text-red-700">
                          Cancelar
                        </button>
                      )}
                    </form>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {matches.length === 0 && (
        <p role="status" className="rounded bg-white p-6">
          No hay partidos registrados.
        </p>
      )}
    </section>
  );
}
