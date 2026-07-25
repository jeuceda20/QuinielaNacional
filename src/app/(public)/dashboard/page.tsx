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
    new GetPendingPredictions(new PrismaPendingPredictionRepository()).execute(
      session.user.id,
      now,
    ),
    prisma.standing.findFirst({
      where: { userId: session.user.id },
      select: {
        position: true,
        previousPosition: true,
        totalPoints: true,
        exactCount: true,
        partialCount: true,
      },
    }),
    prisma.standing.findMany({
      take: 5,
      orderBy: [{ position: "asc" }, { user: { nickname: "asc" } }],
      select: { position: true, totalPoints: true, user: { select: { nickname: true } } },
    }),
    prisma.user.findFirst({
      where: { id: session.user.id, deletedAt: null },
      select: { nickname: true },
    }),
  ]);
  const next = pending[0];
  return (
    <section className="w-full space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Hola, {user?.nickname ?? "participante"}</h1>
        <p className="text-sm text-slate-600">Resumen de tu quiniela.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded bg-white p-4 shadow">
          <strong>Posición</strong>
          <p className="text-2xl">{own?.position ?? "—"}</p>
          <p className="text-sm">
            {own
              ? getStandingTrend({
                  currentPosition: own.position,
                  previousPosition: own.previousPosition,
                })
              : "NEW"}
          </p>
        </article>
        <article className="rounded bg-white p-4 shadow">
          <strong>Puntos</strong>
          <p className="text-2xl">{own?.totalPoints ?? 0}</p>
          <p className="text-sm">
            {own?.exactCount ?? 0} exactos · {own?.partialCount ?? 0} parciales
          </p>
        </article>
        <article className="rounded bg-white p-4 shadow">
          <strong>Pendientes</strong>
          <p className="text-2xl">{pending.length}</p>
          <Link href="/predictions" className="text-sm text-blue-700">
            Ir a pronosticar
          </Link>
        </article>
      </div>
      <article className="rounded bg-white p-4 shadow">
        <h2 className="font-semibold">Próximo cierre</h2>
        {next ? (
          <p className="mt-2">
            {next.homeTeam.name} vs {next.awayTeam.name} ·{" "}
            {next.predictionClosesAt.toLocaleString("es-HN")}
            {next.isDoublePoints ? " · Partido doble" : ""}
          </p>
        ) : (
          <p className="mt-2">No tienes pronósticos pendientes.</p>
        )}
      </article>
      <article className="rounded bg-white p-4 shadow">
        <h2 className="font-semibold">Top 5</h2>
        <ol className="mt-2 space-y-1">
          {top.map((standing) => (
            <li key={standing.user.nickname}>
              {standing.position}. {standing.user.nickname} — {standing.totalPoints} puntos
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}
