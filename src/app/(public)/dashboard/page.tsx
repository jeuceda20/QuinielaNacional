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
  const [pending, own, top, user] = await Promise.all([
    new GetPendingPredictions(new PrismaPendingPredictionRepository()).execute(session.user.id, now),
    prisma.standing.findFirst({
      where: { userId: session.user.id, season: { status: "ACTIVE", archivedAt: null } },
      select: { position: true, previousPosition: true, totalPoints: true, doublePoints: true, exactCount: true, partialCount: true },
    }),
    prisma.standing.findMany({
      where: { season: { status: "ACTIVE", archivedAt: null } },
      take: 5,
      orderBy: [{ position: "asc" }, { user: { nickname: "asc" } }],
      select: { position: true, totalPoints: true, user: { select: { nickname: true } } },
    }),
    prisma.user.findFirst({
      where: { id: session.user.id, deletedAt: null },
      select: { nickname: true, favoriteTeam: { select: { name: true } } },
    }),
  ]);
  const next = pending[0];
  const nickname = user?.nickname ?? "participante";
  const favoriteTeamEmoji = user?.favoriteTeam?.name.split(" ")[0] ?? nickname.slice(0, 1).toUpperCase();
  const closesIn = next ? Math.max(0, Math.ceil((next.predictionClosesAt.getTime() - now.getTime()) / 60_000)) : null;
  const closeCountdown = closesIn === null ? null : closesIn >= 60 ? `${Math.floor(closesIn / 60)} h ${closesIn % 60} min` : `${closesIn} min`;

  return (
    <section className="w-full space-y-6">
      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4"><div className="flex size-14 items-center justify-center rounded-full bg-blue-600 text-3xl" aria-label={`Equipo favorito: ${user?.favoriteTeam?.name ?? "sin equipo"}`}>{favoriteTeamEmoji}</div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Quiniela la Goleada</p><h1 className="text-2xl font-bold">Hola, {nickname}</h1><p className="text-sm text-gray-400">Centro de control de tu quiniela.</p></div></div>
        <p className="mt-4 text-sm text-gray-400 sm:mt-0 sm:text-right">{own?.totalPoints ?? 0} puntos · {own?.exactCount ?? 0} exactos · {own?.partialCount ?? 0} parciales · <span className="text-cyan-300">+{own?.doublePoints ?? 0} bonus PJx2</span></p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl"><strong>Posición actual</strong><p className="text-2xl">{own?.position ?? "—"}</p><p className="text-sm text-gray-400">{own ? getStandingTrend({ currentPosition: own.position, previousPosition: own.previousPosition }) : "NEW"}</p></article>
        <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl"><strong>Próximo partido</strong><p className="mt-1 truncate text-lg font-semibold">{next ? `${next.homeTeam.name} vs ${next.awayTeam.name}` : "Sin partidos próximos"}</p><p className="mt-1 text-sm text-gray-400">{next ? `Cierra en ${closeCountdown} · ${next.predictionClosesAt.toLocaleString("es-HN")}` : "Revisa las jornadas"}</p></article>
        <article className="rounded-2xl border border-cyan-400/30 bg-gray-900 p-5 shadow-xl"><strong>Pendientes</strong><p className="text-2xl">{pending.length}</p><Link href="/predictions" className="text-sm text-cyan-300 hover:text-cyan-200">Ir a pronosticar</Link></article>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)]">
        <div className="grid gap-5 sm:grid-cols-3">
          <DashboardLink href="/predictions" eyebrow="Juega ahora" title="Pronósticos" description="Registra y actualiza tus marcadores antes del cierre." accent="cyan" />
          <DashboardLink href="/standings" eyebrow="Competencia" title="Tabla de posiciones" description="Sigue tu puesto y el rendimiento de todos los participantes." accent="blue" />
          <DashboardLink href="/community-predictions" eyebrow="Comunidad" title="Pronósticos de la comunidad" description="Consulta los picks de todos después de cada cierre." accent="violet" />
        </div>
        <aside className="space-y-5">
          <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl"><h2 className="font-semibold">Próximo cierre</h2>{next ? <p className="mt-2 text-sm text-gray-300">{next.homeTeam.name} vs {next.awayTeam.name} · Cierra en {closeCountdown}{next.isDoublePoints ? " · 🔥 PJx2" : ""}</p> : <p className="mt-2 text-sm text-gray-400">No tienes pronósticos pendientes.</p>}</article>
          <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl"><h2 className="font-semibold">Reglas rápidas</h2><p className="mt-2 text-sm text-gray-400">Parcial: 1 punto. Exacto: 3 puntos. El partido de la jornada vale doble.</p><p className="mt-2 text-sm text-gray-400">Desempates: puntos totales, resultados exactos y exactos en partidos de jornada.</p></article>
          <article className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl"><h2 className="font-semibold">Top 5</h2><ol className="mt-2 space-y-1 text-sm text-gray-300">{top.map((standing) => <li key={standing.user.nickname}>{standing.position}. {standing.user.nickname} — {standing.totalPoints} puntos</li>)}</ol></article>
        </aside>
      </div>
    </section>
  );
}

function DashboardLink({ href, eyebrow, title, description, accent }: Readonly<{ href: string; eyebrow: string; title: string; description: string; accent: "cyan" | "blue" | "violet" }>) {
  const styles = { cyan: "border-cyan-400/35 bg-cyan-400/10 hover:bg-cyan-400/15 text-cyan-300", blue: "border-blue-500/35 bg-blue-600/10 hover:bg-blue-600/15 text-blue-300", violet: "border-violet-400/35 bg-violet-400/10 hover:bg-violet-400/15 text-violet-300" }[accent];
  return <Link href={href} className={`rounded-3xl border p-6 shadow-xl transition ${styles}`}><p className="text-xs font-bold uppercase tracking-[0.18em]">{eyebrow}</p><h2 className="mt-3 text-xl font-bold text-white">{title}</h2><p className="mt-2 text-sm text-gray-300">{description}</p><span className="mt-6 inline-block font-semibold text-white">Ver →</span></Link>;
}
