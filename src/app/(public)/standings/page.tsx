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
        <p className="text-sm text-gray-400">Resultados oficiales procesados.</p>
      </div>
      {standings.length ? (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-xl md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-950 text-gray-300">
                <tr>
                  {["Posición", "Nickname", "Parciales", "Exactos", "Exactos jornada", "Puntos", "Tendencia"].map(
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
                  <tr key={standing.nickname} className={`border-t border-gray-800 ${standing.position <= 3 ? "bg-gray-800/40" : ""}`}>
                    <td className={`px-4 py-3 font-bold ${standing.position === 1 ? "text-yellow-300" : standing.position === 2 ? "text-gray-300" : standing.position === 3 ? "text-orange-300" : ""}`}>{standing.position}</td>
                    <td className="px-4 py-3">{standing.nickname}</td>
                    <td className="px-4 py-3">{standing.partialCount}</td>
                    <td className="px-4 py-3">{standing.exactCount}</td>
                    <td className="px-4 py-3 text-cyan-300">{standing.doubleExactCount}</td>
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
              <article key={standing.nickname} className="rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-xl">
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
                  {standing.totalPoints} puntos · {standing.exactCount} exactos · {standing.doubleExactCount} exactos de jornada ·{" "}
                  {standing.partialCount} parciales
                </p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p role="status" className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-gray-300 shadow-xl">
          Aún no hay clasificación publicada.
        </p>
      )}
    </section>
  );
}
