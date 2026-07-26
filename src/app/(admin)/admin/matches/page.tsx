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
  const [matches, teams, rounds] = await Promise.all([
    prisma.match.findMany({
      where: { archivedAt: null },
      orderBy: { scheduledAt: "asc" },
      include: {
        round: { select: { name: true } },
        homeTeam: { select: { name: true } },
        awayTeam: { select: { name: true } },
        _count: { select: { predictions: true } },
        predictions: {
          where: { deletedAt: null },
          select: { homeGoals: true, awayGoals: true, user: { select: { nickname: true } } },
          orderBy: { submittedAt: "asc" },
        },
      },
    }),
    prisma.team.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.round.findMany({ where: { archivedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);
  const now = new Date();
  return (
    <section className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partidos</h1>
        <p className="text-sm text-gray-400">
          Orden cronológico por fecha oficial. Los resultados se gestionan en otra fase.
        </p>
      </div>
      <form action={matchAction} className="grid gap-2 rounded-2xl border border-yellow-400/25 bg-gray-900 p-4 shadow-xl sm:grid-cols-5">
        <input type="hidden" name="action" value="create" />
        <select name="roundId" aria-label="Jornada" required className="rounded-xl border border-gray-800 p-2">
          <option value="">Jornada</option>
          {rounds.map((round) => (
            <option key={round.id} value={round.id}>
              {round.name}
            </option>
          ))}
        </select>
        <select name="homeTeamId" aria-label="Equipo local" required className="rounded-xl border border-gray-800 p-2">
          <option value="">Local</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <select
          name="awayTeamId"
          aria-label="Equipo visitante"
          required
          className="rounded-xl border border-gray-800 p-2"
        >
          <option value="">Visitante</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <input
          name="scheduledAt"
          aria-label="Fecha y hora programada"
          type="datetime-local"
          required
          className="rounded-xl border border-gray-800 p-2"
        />
        <button className="rounded-xl bg-yellow-400 p-2 font-semibold text-gray-950 hover:bg-yellow-300">Crear partido</button>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-300">
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
              <tr key={m.id} className="border-t border-gray-800">
                <td className="px-3 py-3">{m.scheduledAt.toLocaleString("es-HN")}</td>
                <td className="px-3 py-3">{m.round.name}</td>
                <td className="px-3 py-3">{m.homeTeam.name}</td>
                <td className="px-3 py-3">{m.awayTeam.name}</td>
                <td className="px-3 py-3">{m.status}</td>
                <td className="px-3 py-3">{m.predictionClosesAt.toLocaleString("es-HN")}</td>
                <td className="px-3 py-3">{m.isDoublePoints ? "Sí" : "No"}</td>
                <td className="px-3 py-3">{m._count.predictions}</td>
                <td className="px-3 py-3">
                  {m.status === "FINISHED_PENDING" ? (
                    <ProcessResultForm matchId={m.id} />
                  ) : ["SCHEDULED", "RESCHEDULED", "CLOSED", "SUSPENDED", "RESUMED"].includes(m.status) ? (
                    <form action={matchAction}>
                      <input type="hidden" name="matchId" value={m.id} />
                      <button name="action" value="finish" className="rounded bg-yellow-400 px-2 py-1 text-xs font-semibold text-gray-950">
                        Registrar resultado
                      </button>
                    </form>
                  ) : "—"}
                </td>
                <td className="px-3 py-3">
                  <details>
                    <summary className="cursor-pointer text-yellow-300">Ver detalle</summary>
                    <p>ID: {m.id}</p>
                    <p>Estado deportivo: {m.status}</p>
                    <p>No hay resultado oficial en esta pantalla.</p>
                    {m.predictionClosesAt <= now ? (
                      <div className="mt-3 rounded border border-gray-800 bg-gray-950 p-2 text-sm">
                        <p className="font-semibold text-cyan-200">Pronósticos recibidos ({m.predictions.length})</p>
                        {m.predictions.length ? (
                          <ul className="mt-1 space-y-1 text-gray-300">
                            {m.predictions.map((prediction) => (
                              <li key={prediction.user.nickname}>{prediction.user.nickname}: {prediction.homeGoals} - {prediction.awayGoals}</li>
                            ))}
                          </ul>
                        ) : <p className="mt-1 text-gray-400">No se registraron pronósticos.</p>}
                      </div>
                    ) : <p className="mt-3 text-gray-400">Los pronósticos se mostrarán al cerrar el plazo.</p>}
                    <form action={matchAction} className="mt-2 grid gap-1">
                      <input type="hidden" name="matchId" value={m.id} />
                      <input
                        name="reason"
                        placeholder="Motivo (mínimo 3 caracteres)"
                        aria-label={`Motivo para ${m.homeTeam.name}`}
                        minLength={3}
                        required
                        className="rounded border border-gray-800 p-1"
                      />
                      <p className="text-xs text-gray-400">Obligatorio para reprogramar, suspender o cancelar.</p>
                      <input
                        name="scheduledAt"
                        type="datetime-local"
                        aria-label={`Nueva fecha para ${m.homeTeam.name}`}
                        className="rounded border border-gray-800 p-1"
                      />
                      <button name="action" value="reschedule" className="text-left text-yellow-300">
                        Reprogramar
                      </button>
                      {!m.isDoublePoints && (
                        <button formNoValidate name="action" value="double" className="text-left text-yellow-300">
                          Designar doble
                        </button>
                      )}
                      {["SCHEDULED", "RESCHEDULED", "CLOSED"].includes(m.status) && (
                        <button name="action" value="suspend" className="text-left text-yellow-300">
                          Suspender
                        </button>
                      )}
                      {m.status === "SUSPENDED" && (
                        <button formNoValidate name="action" value="resume" className="text-left text-yellow-300">
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
        <p role="status" className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-gray-300 shadow-xl">
          No hay partidos registrados.
        </p>
      )}
    </section>
  );
}
