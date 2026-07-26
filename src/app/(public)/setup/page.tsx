import { PrismaTeamRepository } from "@/modules/sports/infrastructure/prisma-sports-repositories";
import { redirect } from "next/navigation";

import { initialSetupAction } from "./actions";

import { prisma } from "@/lib/prisma";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN", deletedAt: null },
    select: { id: true },
  });
  if (existingSuperAdmin) redirect("/login");
  const teams = await new PrismaTeamRepository().listActive();
  const { error } = await searchParams;
  return (
    <section className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Configurar superadministrador</h1>
      <p className="mt-2 text-sm text-slate-600">
        Esta pantalla se bloquea al crear la primera cuenta.
      </p>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          No fue posible completar el setup. Revisa el token y que no exista otro
          superadministrador.
        </p>
      )}
      <form action={initialSetupAction} className="mt-6 grid gap-4">
        <input name="firstName" required placeholder="Nombre" className="rounded border p-2" />
        <input name="lastName" required placeholder="Apellido" className="rounded border p-2" />
        <input
          name="nickname"
          required
          minLength={3}
          placeholder="Nickname"
          className="rounded border p-2"
        />
        <input
          name="email"
          required
          type="email"
          placeholder="Correo"
          className="rounded border p-2"
        />
        <input
          name="password"
          required
          type="password"
          minLength={12}
          placeholder="Contraseña (mínimo 12 caracteres)"
          className="rounded border p-2"
        />
        <select name="favoriteTeamId" required className="rounded border p-2">
          <option value="">Equipo favorito</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <input
          name="setupToken"
          required
          type="password"
          placeholder="Token inicial"
          className="rounded border p-2"
        />
        <button className="rounded bg-blue-700 px-4 py-3 font-semibold text-white">
          Crear superadministrador
        </button>
      </form>
    </section>
  );
}
