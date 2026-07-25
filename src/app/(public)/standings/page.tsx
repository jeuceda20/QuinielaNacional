import { GetPublicStandings } from "@/modules/standings/application/get-public-standings";
import { getStandingTrend } from "@/modules/standings/domain/get-standing-trend";
import { PrismaPublicStandingsRepository } from "@/modules/standings/infrastructure/prisma-public-standings-repository";

export const dynamic = "force-dynamic";

function trendLabel(trend: ReturnType<typeof getStandingTrend>) {
  return { UP: "↑", DOWN: "↓", SAME: "→", NEW: "NEW" }[trend];
}

export default async function StandingsPage() {
  const standings = await new GetPublicStandings(new PrismaPublicStandingsRepository()).execute();

  return (
    <section className="w-full space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Clasificación</h1>
        <p className="text-sm text-slate-600">Resultados oficiales procesados.</p>
      </div>
      {standings.length ? (
        <>
          <div className="hidden overflow-x-auto rounded bg-white shadow md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  {["Posición", "Nickname", "Parciales", "Exactos", "Puntos", "Tendencia"].map(
                    (label) => (
                      <th key={label} className="px-4 py-3">
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {standings.map((standing) => (
                  <tr key={standing.nickname} className="border-t">
                    <td className="px-4 py-3">{standing.position}</td>
                    <td className="px-4 py-3">{standing.nickname}</td>
                    <td className="px-4 py-3">{standing.partialCount}</td>
                    <td className="px-4 py-3">{standing.exactCount}</td>
                    <td className="px-4 py-3">{standing.totalPoints}</td>
                    <td className="px-4 py-3">
                      {trendLabel(
                        getStandingTrend({
                          currentPosition: standing.position,
                          previousPosition: standing.previousPosition,
                        }),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {standings.map((standing) => (
              <article key={standing.nickname} className="rounded bg-white p-4 shadow">
                <div className="flex justify-between">
                  <strong>
                    {standing.position}. {standing.nickname}
                  </strong>
                  <span>
                    {trendLabel(
                      getStandingTrend({
                        currentPosition: standing.position,
                        previousPosition: standing.previousPosition,
                      }),
                    )}
                  </span>
                </div>
                <p className="mt-2 text-sm">
                  {standing.totalPoints} puntos · {standing.exactCount} exactos ·{" "}
                  {standing.partialCount} parciales
                </p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p role="status" className="rounded bg-white p-6">
          Aún no hay clasificación publicada.
        </p>
      )}
    </section>
  );
}
