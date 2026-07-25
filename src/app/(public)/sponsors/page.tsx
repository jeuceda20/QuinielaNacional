import { PrismaSponsorRepository } from "@/modules/sponsors/infrastructure/prisma-sponsor-repository";
export default async function SponsorsPage() {
  const sponsors = await new PrismaSponsorRepository().listActive(new Date());
  return (
    <section className="w-full space-y-4">
      <h1 className="text-2xl font-bold">Patrocinadores</h1>
      {sponsors.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {sponsors.map((sponsor) => (
            <article key={sponsor.name} className="rounded bg-white p-4 shadow">
              {sponsor.imagePath && <img src={sponsor.imagePath} alt="" className="h-12 w-auto" />}
              <strong>{sponsor.name}</strong>
              {sponsor.targetUrl && (
                <a
                  href={sponsor.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 text-blue-700"
                >
                  Visitar
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p role="status">No hay patrocinadores activos.</p>
      )}
    </section>
  );
}
