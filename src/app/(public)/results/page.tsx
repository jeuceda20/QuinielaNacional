import { GetPublicResults } from "@/modules/results/application/get-public-results";
import { PrismaPublicResultsRepository } from "@/modules/results/infrastructure/prisma-public-results-repository";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const results = await new GetPublicResults(new PrismaPublicResultsRepository()).execute();

  return (
    <section className="w-full space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Resultados</h1>
        <p className="text-sm text-slate-600">Partidos con resultado oficial procesado.</p>
      </div>
      {results.length ? (
        results.map((result) => (
          <article key={result.id} className="overflow-x-auto rounded bg-white p-4 shadow">
            <h2 className="font-semibold">
              {result.roundName}: {result.homeTeam} {result.officialResult} {result.awayTeam}
            </h2>
            <table className="mt-3 min-w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  {["Nickname", "Pronóstico", "Resultado", "Tipo", "Puntos"].map((label) => (
                    <th key={label} className="px-2 py-2">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.nickname} className="border-b">
                    <td className="px-2 py-2">{row.nickname}</td>
                    <td className="px-2 py-2">{row.prediction ?? "Sin pronóstico"}</td>
                    <td className="px-2 py-2">{result.officialResult}</td>
                    <td className="px-2 py-2">{row.scoreType}</td>
                    <td className="px-2 py-2">{row.awardedPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))
      ) : (
        <p role="status" className="rounded bg-white p-6">
          Aún no hay resultados procesados.
        </p>
      )}
    </section>
  );
}
