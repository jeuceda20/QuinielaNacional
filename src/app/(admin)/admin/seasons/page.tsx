import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { RecalculateSeasonForm } from "@/modules/standings/ui/recalculate-season-form";

import { prisma } from "@/lib/prisma";

import { seasonAction } from "./actions";

export default async function SeasonsPage() {
  const token = (await cookies()).get("session")?.value;
  const session = token ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date()) : null;
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) redirect("/login");
  const seasons = await prisma.season.findMany({
    where: { archivedAt: null },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { rounds: true, matches: true, standings: true } } },
  });

  return (
    <section className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Temporadas</h1>
        <p className="text-sm text-gray-400">Crea, activa y controla las temporadas. El identificador técnico se genera automáticamente.</p>
      </div>
      <form action={seasonAction} className="grid gap-3 rounded-2xl border border-yellow-400/25 bg-gray-900 p-5 shadow-xl sm:grid-cols-3">
        <input type="hidden" name="action" value="create" />
        <input name="name" aria-label="Nombre de temporada" placeholder="Ej.: Apertura 2026" required className="rounded-xl border border-gray-800 p-2" />
        <input name="startsAt" aria-label="Fecha de inicio" type="date" required className="rounded-xl border border-gray-800 p-2" />
        <button className="rounded-xl bg-yellow-400 p-2 font-semibold text-gray-950 hover:bg-yellow-300">Crear temporada</button>
      </form>
      <div className="grid gap-4">
        {seasons.map((season) => (
          <article key={season.id} className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="font-bold">{season.name}</h2><p className="text-sm text-gray-400">{season._count.rounds} jornadas · {season._count.matches} partidos · Estado: {season.status}</p></div>
              {season.status === "DRAFT" && <form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="activate" className="rounded-xl bg-yellow-400 px-3 py-2 font-semibold text-gray-950">Activar temporada</button></form>}
              {season.status === "ACTIVE" && <div className="flex gap-2"><form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="join" className="rounded-xl border border-cyan-400/50 px-3 py-2 font-semibold text-cyan-200 hover:bg-cyan-400/10">Participar</button></form><form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="close" className="rounded-xl border border-yellow-400/50 px-3 py-2 font-semibold text-yellow-200 hover:bg-yellow-400/10">Cerrar temporada</button></form></div>}
            </div>
            {session.user.role === "SUPER_ADMIN" && <div className="mt-4"><RecalculateSeasonForm seasonId={season.id} standingCount={season._count.standings} /></div>}
          </article>
        ))}
      </div>
    </section>
  );
}
