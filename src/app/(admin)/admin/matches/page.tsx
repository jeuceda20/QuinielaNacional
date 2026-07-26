import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { CorrectResultForm } from "@/modules/results/ui/correct-result-form";
import { ProcessResultForm } from "@/modules/results/ui/process-result-form";

import { prisma } from "@/lib/prisma";

import { seasonAction } from "../seasons/actions";
import { matchAction } from "./actions";

type Props = Readonly<{ searchParams: Promise<{ season?: string; round?: string; error?: string }> }>;

export default async function MatchesPage({ searchParams }: Props) {
  const params = await searchParams;
  const t = (await cookies()).get("session")?.value,
    s = t ? await new SessionService(new PrismaSessionRepository()).validate(t, new Date()) : null;
  if (!s || (s.user.role !== "ADMIN" && s.user.role !== "SUPER_ADMIN")) redirect("/login");
  const seasons = await prisma.season.findMany({
    where: { archivedAt: null },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: { id: true, name: true, status: true },
  });
  const selectedSeasonId = params.season ?? seasons.find((season) => season.status === "ACTIVE")?.id ?? seasons[0]?.id;
  const rounds = selectedSeasonId
    ? await prisma.round.findMany({ where: { seasonId: selectedSeasonId, archivedAt: null }, orderBy: [{ sequence: "asc" }, { createdAt: "asc" }] })
    : [];
  const selectedRoundId = params.round ?? "";
  const [matches, teams] = await Promise.all([
    prisma.match.findMany({
      where: { archivedAt: null, seasonId: selectedSeasonId, ...(selectedRoundId ? { roundId: selectedRoundId } : {}) },
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
  ]);
  const now = new Date();
  const toDateTimeLocal = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
  const doubleRoundIds = new Set(matches.filter((match) => match.isDoublePoints).map((match) => match.roundId));
  return (
    <section className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Jornadas y partidos</h1>
        <p className="text-sm text-gray-400">
          Orden cronológico por fecha oficial. Los resultados se gestionan en otra fase.
        </p>
      </div>
      {params.error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{params.error}</p>}
      <form className="grid gap-2 rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:grid-cols-3">
        <select name="season" defaultValue={selectedSeasonId} aria-label="Filtrar por temporada" className="rounded-xl border border-gray-800 p-2">
          <option value="">Sin temporada</option>
          {seasons.map((season) => <option key={season.id} value={season.id}>{season.name} · {season.status}</option>)}
        </select>
        <select name="round" defaultValue={selectedRoundId} aria-label="Filtrar por jornada" className="rounded-xl border border-gray-800 p-2">
          <option value="">Todas las jornadas</option>
          {rounds.map((round) => <option key={round.id} value={round.id}>{round.name}</option>)}
        </select>
        <button className="rounded-xl border border-yellow-400/50 px-3 py-2 font-semibold text-yellow-200 hover:bg-yellow-400/10">Aplicar filtros</button>
      </form>
      <form action={seasonAction} className="grid gap-2 rounded-2xl border border-yellow-400/25 bg-gray-900 p-4 shadow-xl sm:grid-cols-3">
        <input type="hidden" name="action" value="round" />
        <select name="seasonId" defaultValue={selectedSeasonId} aria-label="Temporada para jornada" required className="rounded-xl border border-gray-800 p-2">
          <option value="">Temporada</option>
          {seasons.map((season) => <option key={season.id} value={season.id}>{season.name} · {season.status}</option>)}
        </select>
        <input name="roundName" aria-label="Nombre de jornada" placeholder="Ej.: Jornada 1" required className="rounded-xl border border-gray-800 p-2" />
        <button className="rounded-xl border border-yellow-400/50 px-3 py-2 font-semibold text-yellow-200 hover:bg-yellow-400/10">Crear jornada</button>
        <p className="text-xs text-gray-400 sm:col-span-3">El número de jornada se asigna automáticamente según el orden de creación.</p>
      </form>
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
                <td className="px-3 py-3">{m.isDoublePoints ? "🔥 Partido de la jornada" : "—"}</td>
                <td className="px-3 py-3">{m._count.predictions}</td>
                <td className="px-3 py-3">
                  {m.status === "FINISHED_PENDING" ? (
                    <ProcessResultForm matchId={m.id} />
                  ) : m.status === "PROCESSED" && m.officialHomeGoals !== null && m.officialAwayGoals !== null ? (
                    <div className="space-y-2">
                      <p className="rounded bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                        Resultado: {m.officialHomeGoals} - {m.officialAwayGoals}
                      </p>
                      {s.user.role === "SUPER_ADMIN" && (
                        <CorrectResultForm
                          matchId={m.id}
                          homeGoals={m.officialHomeGoals}
                          awayGoals={m.officialAwayGoals}
                        />
                      )}
                    </div>
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
                      <input type="hidden" name="roundId" value={m.roundId} />
                      {['SCHEDULED', 'RESCHEDULED'].includes(m.status) && (
                        <div className="grid gap-1 rounded border border-yellow-400/20 p-2">
                          <p className="text-xs font-semibold text-yellow-200">Editar equipos y hora</p>
                          <select name="homeTeamId" defaultValue={m.homeTeamId} className="rounded border border-gray-800 p-1">{teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select>
                          <select name="awayTeamId" defaultValue={m.awayTeamId} className="rounded border border-gray-800 p-1">{teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select>
                          <input name="scheduledAt" type="datetime-local" defaultValue={toDateTimeLocal(m.scheduledAt)} className="rounded border border-gray-800 p-1" />
                          <button name="action" value="edit-scheduled" className="text-left text-yellow-300">Guardar cambios del partido</button>
                        </div>
                      )}
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
                      {!m.isDoublePoints && !doubleRoundIds.has(m.roundId) && (
                        <button formNoValidate name="action" value="double" className="text-left text-yellow-300">
                          🔥 Designar partido de la jornada
                        </button>
                      )}
                      {!m.isDoublePoints && doubleRoundIds.has(m.roundId) && (
                        <p className="text-xs text-yellow-200">Esta jornada ya tiene un partido doble.</p>
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
