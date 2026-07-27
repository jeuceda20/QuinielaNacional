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
  const approvedUsers = await prisma.user.findMany({
    where: { status: "APPROVED", deletedAt: null },
    orderBy: { nickname: "asc" },
    select: { id: true, nickname: true, firstName: true, lastName: true },
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
          <article key={season.id} className="rounded-2xl border border-gray-700 bg-gray-900 p-5 shadow-xl shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="font-bold">{season.name}</h2><p className="text-sm text-gray-400">{season._count.rounds} jornadas · {season._count.matches} partidos · Estado: {season.status}</p></div>
              {season.status === "DRAFT" && <form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="activate" className="rounded-xl bg-yellow-400 px-3 py-2 font-semibold text-gray-950">Activar temporada</button></form>}
              {season.status === "DRAFT" && <div className="flex gap-2"><form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="delete" className="rounded-xl border border-red-400/50 px-3 py-2 font-semibold text-red-200 hover:bg-red-400/10">Eliminar borrador vacío</button></form><form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="archive" className="rounded-xl border border-gray-700 px-3 py-2 text-gray-300 hover:bg-gray-800">Archivar</button></form></div>}
              {season.status === "ACTIVE" && <div className="flex gap-2"><form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="join" className="rounded-xl border border-cyan-400/50 px-3 py-2 font-semibold text-cyan-200 hover:bg-cyan-400/10">Participar</button></form><form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="close" className="rounded-xl border border-yellow-400/50 px-3 py-2 font-semibold text-yellow-200 hover:bg-yellow-400/10">Cerrar temporada</button></form></div>}
              {season.status === "CLOSED" && <div className="flex gap-2"><form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="reactivate" className="rounded-xl border border-cyan-400/50 px-3 py-2 font-semibold text-cyan-200 hover:bg-cyan-400/10">Reactivar temporada</button></form><form action={seasonAction}><input type="hidden" name="seasonId" value={season.id} /><button name="action" value="archive" className="rounded-xl border border-red-400/50 px-3 py-2 font-semibold text-red-200 hover:bg-red-400/10">Archivar temporada</button></form></div>}
            </div>
            {season.status === "ACTIVE" && (
              <form action={seasonAction} className="mt-4 grid gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-4 sm:grid-cols-[1fr_auto]">
                <input type="hidden" name="action" value="participant" />
                <input type="hidden" name="seasonId" value={season.id} />
                <label className="grid gap-1 text-sm font-medium text-cyan-100">Agregar usuario aprobado<select name="userId" required className="rounded-lg border border-gray-700 bg-gray-950 p-2 text-white"><option value="">Selecciona un usuario</option>{approvedUsers.map((user) => <option key={user.id} value={user.id}>{user.nickname} · {user.firstName} {user.lastName}</option>)}</select></label>
                <button className="self-end rounded-lg bg-cyan-400 px-3 py-2 font-semibold text-gray-950 hover:bg-cyan-300">Agregar a temporada</button>
                <p className="text-xs text-cyan-100/70 sm:col-span-2">Los usuarios nuevos aprobados se agregan automáticamente. Este control sirve para cuentas ya aprobadas.</p>
              </form>
            )}
            {session.user.role === "SUPER_ADMIN" && <div className="mt-4"><RecalculateSeasonForm seasonId={season.id} standingCount={season._count.standings} /></div>}
          </article>
        ))}
      </div>
    </section>
  );
}
