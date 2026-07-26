import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { RecalculateSeasonForm } from "@/modules/standings/ui/recalculate-season-form";

import { prisma } from "@/lib/prisma";

import { seasonAction } from "./actions";
export default async function SeasonsPage() {
  const t = (await cookies()).get("session")?.value,
    s = t ? await new SessionService(new PrismaSessionRepository()).validate(t, new Date()) : null;
  if (!s || (s.user.role !== "ADMIN" && s.user.role !== "SUPER_ADMIN")) redirect("/login");
  const seasons = await prisma.season.findMany({
    where: { archivedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      rounds: { where: { archivedAt: null }, orderBy: { sequence: "asc" } },
      participants: {
        include: {
          user: { select: { nickname: true, firstName: true, lastName: true, status: true } },
        },
        take: 20,
      },
      _count: { select: { standings: true } },
    },
  });
  return (
    <section className="w-full space-y-6">
      <h1 className="text-2xl font-bold">Temporadas y jornadas</h1>
      <form
        action={seasonAction}
        className="grid gap-2 rounded bg-white p-4 shadow-sm sm:grid-cols-4"
      >
        <input type="hidden" name="action" value="create" />
        <input
          name="name"
          aria-label="Nombre de temporada"
          placeholder="Nombre de temporada"
          required
          className="rounded border p-2"
        />
        <input name="slug" aria-label="Slug de temporada" placeholder="slug-temporada" required className="rounded border p-2" />
        <input name="startsAt" aria-label="Fecha de inicio" type="date" required className="rounded border p-2" />
        <button className="rounded bg-blue-700 p-2 font-semibold text-white">Crear borrador</button>
      </form>
      {seasons.map((x) => (
        <article key={x.id} className="rounded bg-white p-4 shadow-sm">
          <h2 className="font-bold">
            {x.name} <span className="text-sm font-normal">Estado: {x.status}</span>
          </h2>
          <form action={seasonAction} className="mt-3 flex flex-wrap gap-2">
            <input type="hidden" name="seasonId" value={x.id} />
            {x.status === "DRAFT" && (
              <button
                name="action"
                value="activate"
                className="rounded bg-blue-700 px-3 py-2 text-white"
              >
                Activar temporada
              </button>
            )}
            <input name="userId" aria-label="ID de usuario" placeholder="ID de usuario" className="rounded border p-2" />
            <button name="action" value="participant" className="rounded border px-3">
              Incorporar participante
            </button>
          </form>
          <form action={seasonAction} className="mt-3 flex flex-wrap gap-2">
            <input type="hidden" name="action" value="round" />
            <input type="hidden" name="seasonId" value={x.id} />
            <input
              name="roundName"
              placeholder="Nombre de jornada"
              required
              className="rounded border p-2"
            />
            <input
              name="roundSlug"
              placeholder="slug-jornada"
              required
              className="rounded border p-2"
            />
            <input
              name="sequence"
              type="number"
              defaultValue="1"
              className="w-20 rounded border p-2"
            />
            <button className="rounded border px-3">Crear jornada</button>
          </form>
          <h3 className="mt-4 font-semibold">Jornadas</h3>
          <ul className="mt-2 space-y-2">
            {x.rounds.map((r) => (
              <li key={r.id} className="flex gap-2">
                {r.name} — {r.status}
                <form action={seasonAction}>
                  <input type="hidden" name="roundId" value={r.id} />
                  {r.status === "DRAFT" && (
                    <button name="action" value="publish" className="ml-2 text-blue-700">
                      Publicar
                    </button>
                  )}
                  {r.status !== "ARCHIVED" && (
                    <button name="action" value="archive" className="ml-2 text-red-700">
                      Archivar
                    </button>
                  )}
                </form>
              </li>
            ))}
          </ul>
          <h3 className="mt-4 font-semibold">Participantes</h3>
          <ul>
            {x.participants.map((p) => (
              <li key={p.id}>
                {p.user.nickname} — {p.user.firstName} {p.user.lastName} — {p.user.status} —{" "}
                {p.joinedAt.toLocaleDateString("es-HN")} — 0 puntos iniciales
              </li>
            ))}
          </ul>
          {s.user.role === "SUPER_ADMIN" && (
            <RecalculateSeasonForm seasonId={x.id} standingCount={x._count.standings} />
          )}
        </article>
      ))}
    </section>
  );
}
