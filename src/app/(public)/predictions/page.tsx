import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { disablePrivatePredictionCache } from "@/modules/predictions/infrastructure/prediction-cache";
import { PredictionForm } from "@/modules/predictions/ui/prediction-form";

import { prisma } from "@/lib/prisma";

type MatchCard = Readonly<{
  id: string;
  phase: string;
  scheduledAt: string;
  closesAt: string;
  status: string;
  double: boolean;
  home: string;
  away: string;
  officialHomeGoals: number | null;
  officialAwayGoals: number | null;
  ownPrediction: Readonly<{ homeGoals: number; awayGoals: number; awardedPoints: number | null }> | null;
}>;

function groupByDayAndPhase(matches: readonly MatchCard[]) {
  const groups = new Map<string, { day: string; phase: string; matches: MatchCard[] }>();
  for (const match of matches) {
    const date = new Date(match.scheduledAt);
    const day = date.toLocaleDateString("es-HN", { weekday: "long", day: "numeric", month: "long" });
    const key = `${date.toISOString().slice(0, 10)}:${match.phase}`;
    const group = groups.get(key) ?? { day, phase: match.phase, matches: [] };
    group.matches.push(match);
    groups.set(key, group);
  }
  return [...groups.values()];
}

export default async function PredictionsPage() {
  disablePrivatePredictionCache();
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session) redirect("/login");

  const rows = await prisma.match.findMany({
    where: {
      archivedAt: null,
      season: {
        status: "ACTIVE",
        archivedAt: null,
        participants: { some: { userId: session.user.id, isEligible: true, excludedAt: null } },
      },
      status: { not: "CANCELLED" },
    },
    orderBy: { scheduledAt: "asc" },
    select: {
      id: true,
      scheduledAt: true,
      predictionClosesAt: true,
      status: true,
      resultVersion: true,
      isDoublePoints: true,
      officialHomeGoals: true,
      officialAwayGoals: true,
      round: { select: { name: true } },
      homeTeam: { select: { name: true } },
      awayTeam: { select: { name: true } },
      predictions: {
        where: { userId: session.user.id, deletedAt: null },
        select: { homeGoals: true, awayGoals: true, scores: { select: { awardedPoints: true, resultVersion: true } } },
        take: 1,
      },
    },
  });
  const matches: MatchCard[] = rows.map((match) => ({
    id: match.id,
    phase: match.round.name,
    scheduledAt: match.scheduledAt.toISOString(),
    closesAt: match.predictionClosesAt.toISOString(),
    status: match.status,
    double: match.isDoublePoints,
    home: match.homeTeam.name,
    away: match.awayTeam.name,
    officialHomeGoals: match.officialHomeGoals,
    officialAwayGoals: match.officialAwayGoals,
    ownPrediction: match.predictions[0]
      ? {
          homeGoals: match.predictions[0].homeGoals,
          awayGoals: match.predictions[0].awayGoals,
          awardedPoints: match.predictions[0].scores.find((score) => score.resultVersion === match.resultVersion)?.awardedPoints ?? null,
        }
      : null,
  }));
  const activeGroups = groupByDayAndPhase(matches.filter((match) => match.status !== "PROCESSED"));
  const historyGroups = groupByDayAndPhase(matches.filter((match) => match.status === "PROCESSED").reverse());

  return (
    <section className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <p className="text-sm font-semibold text-cyan-300">CALENDARIO DE PRONÓSTICOS</p>
        <h1 className="mt-2 text-2xl font-bold">Pronósticos</h1>
        <p className="mt-2 text-sm text-gray-400">Edita tu marcador hasta cinco minutos antes del inicio de cada partido.</p>
      </div>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div><h2 className="text-xl font-bold">Partidos activos</h2><p className="text-sm text-gray-400">Disponibles, próximos o ya cerrados sin resultado oficial.</p></div>
          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">{activeGroups.reduce((total, group) => total + group.matches.length, 0)} partidos</span>
        </div>
        {activeGroups.length ? activeGroups.map((group) => (
          <div key={`${group.day}-${group.phase}`} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold capitalize">{group.day}</h3><span className="rounded-full border border-gray-800 bg-gray-900 px-2 py-1 text-xs text-gray-300">{group.phase}</span></div>
            <div className="grid gap-4 md:grid-cols-2">{group.matches.map((match) => <PredictionForm key={match.id} match={match} />)}</div>
          </div>
        )) : <Empty message="No hay partidos activos para la temporada actual." />}
      </section>

      <section className="space-y-5 border-t border-gray-800 pt-8">
        <div><h2 className="text-xl font-bold">Historial procesado</h2><p className="mt-1 text-sm text-gray-400">Consulta tu pick y el resultado oficial de los partidos finalizados.</p></div>
        {historyGroups.length ? historyGroups.map((group) => (
          <div key={`${group.day}-${group.phase}`} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold capitalize">{group.day}</h3><span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200">{group.phase}</span></div>
            <div className="grid gap-4 md:grid-cols-2">{group.matches.map((match) => <PredictionForm key={match.id} match={match} />)}</div>
          </div>
        )) : <Empty message="Aún no hay partidos procesados en esta temporada." />}
      </section>
    </section>
  );
}

function Empty({ message }: Readonly<{ message: string }>) {
  return <p role="status" className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-gray-400 shadow-xl">{message}</p>;
}
