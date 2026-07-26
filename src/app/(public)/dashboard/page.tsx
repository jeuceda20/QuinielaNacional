import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { GetPendingPredictions } from "@/modules/predictions/application/get-pending-predictions";
import { disablePrivatePredictionCache } from "@/modules/predictions/infrastructure/prediction-cache";
import { PrismaPendingPredictionRepository } from "@/modules/predictions/infrastructure/prisma-pending-prediction-repository";
import { getStandingTrend } from "@/modules/standings/domain/get-standing-trend";

import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  disablePrivatePredictionCache();
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session) redirect("/login");

  const now = new Date();
  const [pending, own, top, user, upcomingMatches, ownPredictions, closedMatches] = await Promise.all([
    new GetPendingPredictions(new PrismaPendingPredictionRepository()).execute(session.user.id, now),
    prisma.standing.findFirst({
      where: { userId: session.user.id, season: { status: "ACTIVE", archivedAt: null } },
      select: {
        position: true,
        previousPosition: true,
        totalPoints: true,
        doublePoints: true,
        exactCount: true,
        partialCount: true,
      },
    }),
    prisma.standing.findMany({
      where: { season: { status: "ACTIVE", archivedAt: null } },
      take: 5,
      orderBy: [{ position: "asc" }, { user: { nickname: "asc" } }],
      select: { position: true, totalPoints: true, user: { select: { nickname: true } } },
    }),
    prisma.user.findFirst({
      where: { id: session.user.id, deletedAt: null },
      select: { nickname: true },
    }),
    prisma.match.findMany({
      where: {
        archivedAt: null,
        season: { status: "ACTIVE", archivedAt: null },
        status: { in: ["SCHEDULED", "RESCHEDULED", "RESUMED"] },
        scheduledAt: { gte: now },
      },
      orderBy: { scheduledAt: "asc" },
      take: 5,
      select: {
        id: true,
        scheduledAt: true,
        predictionClosesAt: true,
        isDoublePoints: true,
        homeTeam: { select: { name: true } },
        awayTeam: { select: { name: true } },
        predictions: {
          where: { userId: session.user.id, deletedAt: null },
          select: { homeGoals: true, awayGoals: true },
        },
      },
    }),
    prisma.prediction.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
        match: { archivedAt: null, season: { status: "ACTIVE", archivedAt: null } },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        homeGoals: true,
        awayGoals: true,
        updatedAt: true,
        scores: { select: { awardedPoints: true, resultVersion: true } },
        match: {
          select: {
            resultVersion: true,
            scheduledAt: true,
            isDoublePoints: true,
            officialHomeGoals: true,
            officialAwayGoals: true,
            homeTeam: { select: { name: true } },
            awayTeam: { select: { name: true } },
          },
        },
      },
    }),
    prisma.match.findMany({
      where: {
        archivedAt: null,
        predictionClosesAt: { lte: now },
        status: { not: "CANCELLED" },
        season: { status: "ACTIVE", archivedAt: null },
      },
      orderBy: { scheduledAt: "desc" },
      take: 3,
      select: {
        id: true,
        isDoublePoints: true,
        officialHomeGoals: true,
        officialAwayGoals: true,
        homeTeam: { select: { name: true } },
        awayTeam: { select: { name: true } },
        predictions: {
          where: { deletedAt: null },
          orderBy: { submittedAt: "asc" },
          select: { homeGoals: true, awayGoals: true, user: { select: { nickname: true } } },
        },
      },
    }),
  ]);
  const next = pending[0];
  const nickname = user?.nickname ?? "participante";
  const closesIn = next
    ? Math.max(0, Math.ceil((next.predictionClosesAt.getTime() - now.getTime()) / 60000))
    : null;
  const closeCountdown = closesIn === null
    ? null
    : closesIn >= 1440
      ? `${Math.floor(closesIn / 1440)} día(s) y ${Math.ceil((closesIn % 1440) / 60)} h`
      : closesIn >= 60
        ? `${Math.floor(closesIn / 60)} h y ${closesIn % 60} min`
        : `${closesIn} min`;

  return (
    <section className="w-full space-y-6">
      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
            {nickname.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Quiniela Nacional</p>
            <h1 className="text-2xl font-bold">Hola, {nickname}</h1>
            <p className="text-sm text-gray-400">Centro de control de tu quiniela.</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-400 sm:mt-0 sm:text-right">
          {own?.totalPoints ?? 0} puntos · {own?.exactCount ?? 0} exactos · {own?.partialCount ?? 0} parciales ·{" "}
          <span className="text-cyan-300">{own?.doublePoints ?? 0} puntos PJx2</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
          <strong>Posición actual</strong>
          <p className="text-2xl">{own?.position ?? "—"}</p>
          <p className="text-sm text-gray-400">
            {own ? getStandingTrend({ currentPosition: own.position, previousPosition: own.previousPosition }) : "NEW"}
          </p>
        </article>
        <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
          <strong>Próximo partido</strong>
          <p className="mt-1 truncate text-lg font-semibold">{next ? `${next.homeTeam.name} vs ${next.awayTeam.name}` : "Sin partidos próximos"}</p>
            <p className="mt-1 text-sm text-gray-400">{next ? `Cierra en ${closeCountdown} · ${next.predictionClosesAt.toLocaleString("es-HN")}` : "Revisa las jornadas"}</p>
        </article>
        <article className="rounded-2xl border border-cyan-400/30 bg-gray-900 p-5 shadow-xl">
          <strong>Pendientes</strong>
          <p className="text-2xl">{pending.length}</p>
          <Link href="/predictions" className="text-sm text-cyan-300 hover:text-cyan-200">Ir a pronosticar</Link>
        </article>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Próximos partidos</h2>
            <Link href="/predictions" className="text-sm text-cyan-300 hover:text-cyan-200">Pronosticar</Link>
          </div>
          <div className="mt-3 space-y-2">
            {upcomingMatches.length ? upcomingMatches.map((match) => {
              const prediction = match.predictions[0];
              return (
                <div key={match.id} className="rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>{match.homeTeam.name} vs {match.awayTeam.name}</strong>
                    {match.isDoublePoints && <span className="text-yellow-200">🔥 PJx2</span>}
                  </div>
                  <p className="mt-1 text-gray-400">{match.scheduledAt.toLocaleString("es-HN")}</p>
                  <p className="mt-1 text-cyan-200">{prediction ? `Tu pronóstico: ${prediction.homeGoals} - ${prediction.awayGoals}` : "Aún no has pronosticado"}</p>
                </div>
              );
            }) : <p className="text-sm text-gray-400">No hay partidos próximos en la temporada activa.</p>}
          </div>
        </article>

        <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
          <h2 className="font-semibold">Tus últimos pronósticos</h2>
          <div className="mt-3 space-y-2">
            {ownPredictions.length ? ownPredictions.map((prediction, index) => (
              <div key={`${prediction.match.homeTeam.name}-${prediction.updatedAt.toISOString()}-${index}`} className="rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong>{prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}</strong>
                  {prediction.match.isDoublePoints && <span className="text-yellow-200">🔥 PJx2</span>}
                </div>
                <p className="mt-1 text-cyan-200">Tu pronóstico: {prediction.homeGoals} - {prediction.awayGoals}</p>
                <p className="mt-1 text-gray-400">{prediction.match.officialHomeGoals !== null && prediction.match.officialAwayGoals !== null ? `Resultado oficial: ${prediction.match.officialHomeGoals} - ${prediction.match.officialAwayGoals}` : "Resultado pendiente"}</p>
                {(() => {
                  const score = prediction.scores.find((item) => item.resultVersion === prediction.match.resultVersion);
                  return score ? <p className="mt-1 font-semibold text-emerald-200">Puntos sumados: +{score.awardedPoints}</p> : null;
                })()}
              </div>
            )) : <p className="text-sm text-gray-400">Todavía no has guardado pronósticos en esta temporada.</p>}
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
        <h2 className="font-semibold">Pronósticos de la comunidad</h2>
        <p className="mt-1 text-sm text-gray-400">Se muestran únicamente después de que cierre el plazo de cada partido.</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {closedMatches.length ? closedMatches.map((match) => (
            <div key={match.id} className="rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong>{match.homeTeam.name} vs {match.awayTeam.name}</strong>
                {match.isDoublePoints && <span className="text-yellow-200">🔥 PJx2</span>}
              </div>
              {match.officialHomeGoals !== null && match.officialAwayGoals !== null && <p className="mt-1 text-emerald-200">Resultado: {match.officialHomeGoals} - {match.officialAwayGoals}</p>}
              <ul className="mt-2 space-y-1 text-gray-300">
                {match.predictions.length ? match.predictions.map((prediction) => <li key={prediction.user.nickname}>{prediction.user.nickname}: {prediction.homeGoals} - {prediction.awayGoals}</li>) : <li className="text-gray-400">No hubo pronósticos.</li>}
              </ul>
            </div>
          )) : <p className="text-sm text-gray-400">Aún no hay partidos con plazo cerrado en la temporada activa.</p>}
        </div>
      </article>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)]">
        <div className="grid gap-5 sm:grid-cols-2">
          <Link href="/predictions" className="rounded-3xl border border-cyan-400/35 bg-cyan-400/10 p-6 shadow-xl transition hover:bg-cyan-400/15">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Juega ahora</p>
            <h2 className="mt-3 text-xl font-bold">Pronósticos</h2>
            <p className="mt-2 text-sm text-gray-300">Registra y actualiza tus marcadores antes del cierre.</p>
            <span className="mt-6 inline-block font-semibold text-cyan-200">Ver partidos →</span>
          </Link>
          <Link href="/standings" className="rounded-3xl border border-blue-500/35 bg-blue-600/10 p-6 shadow-xl transition hover:bg-blue-600/15">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Competencia</p>
            <h2 className="mt-3 text-xl font-bold">Tabla de posiciones</h2>
            <p className="mt-2 text-sm text-gray-300">Sigue tu puesto y el rendimiento de todos los participantes.</p>
            <span className="mt-6 inline-block font-semibold text-blue-200">Ver tabla →</span>
          </Link>
        </div>
        <aside className="space-y-5">
          <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
            <h2 className="font-semibold">Próximo cierre</h2>
            {next ? <p className="mt-2 text-sm text-gray-300">{next.homeTeam.name} vs {next.awayTeam.name} · Cierra en {closeCountdown} · {next.predictionClosesAt.toLocaleString("es-HN")}{next.isDoublePoints ? " · Partido doble" : ""}</p> : <p className="mt-2 text-sm text-gray-400">No tienes pronósticos pendientes.</p>}
          </article>
          <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
            <h2 className="font-semibold">Reglas rápidas</h2>
            <p className="mt-2 text-sm text-gray-400">Parcial: 1 punto. Exacto: 3 puntos. El partido de la jornada vale doble.</p>
            <p className="mt-2 text-sm text-gray-400">Desempates: puntos totales, resultados exactos y exactos en partidos de jornada.</p>
          </article>
          <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
            <h2 className="font-semibold">Top 5</h2>
            <ol className="mt-2 space-y-1 text-sm text-gray-300">
              {top.map((standing) => <li key={standing.user.nickname}>{standing.position}. {standing.user.nickname} — {standing.totalPoints} puntos</li>)}
            </ol>
          </article>
        </aside>
      </div>
    </section>
  );
}
