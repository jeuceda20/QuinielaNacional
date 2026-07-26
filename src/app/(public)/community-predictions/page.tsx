import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

import { prisma } from "@/lib/prisma";

export default async function CommunityPredictionsPage() {
  const token = (await cookies()).get("session")?.value;
  const session = token ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date()) : null;
  if (!session) redirect("/login");
  const matches = await prisma.match.findMany({
    where: { archivedAt: null, predictionClosesAt: { lte: new Date() }, status: { not: "CANCELLED" }, season: { status: "ACTIVE", archivedAt: null } },
    orderBy: { scheduledAt: "desc" },
    select: { id: true, isDoublePoints: true, officialHomeGoals: true, officialAwayGoals: true, round: { select: { name: true } }, homeTeam: { select: { name: true } }, awayTeam: { select: { name: true } }, predictions: { where: { deletedAt: null }, orderBy: { submittedAt: "asc" }, select: { homeGoals: true, awayGoals: true, user: { select: { nickname: true } } } } },
  });
  return <section className="mx-auto w-full max-w-4xl space-y-6"><div><p className="text-sm font-semibold text-violet-300">COMUNIDAD</p><h1 className="mt-2 text-2xl font-bold">Pronósticos de la comunidad</h1><p className="mt-2 text-sm text-gray-400">Los picks se revelan al cerrar el plazo de pronóstico.</p></div>{matches.length ? matches.map((match) => <article key={match.id} className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold text-gray-400">{match.round.name}</p><h2 className="font-semibold">{match.homeTeam.name} vs {match.awayTeam.name}</h2></div>{match.isDoublePoints && <span className="text-yellow-200">🔥 PJx2</span>}</div>{match.officialHomeGoals !== null && match.officialAwayGoals !== null && <p className="mt-2 text-emerald-200">Resultado oficial: {match.officialHomeGoals} - {match.officialAwayGoals}</p>}<ul className="mt-3 grid gap-2 sm:grid-cols-2">{match.predictions.length ? match.predictions.map((prediction) => <li key={prediction.user.nickname} className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-300"><strong>{prediction.user.nickname}</strong>: {prediction.homeGoals} - {prediction.awayGoals}</li>) : <li className="text-sm text-gray-400">No hubo pronósticos.</li>}</ul></article>) : <p className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-gray-400">Aún no hay partidos cuyo plazo haya cerrado.</p>}</section>;
}
