import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { env } from "@/lib/env/server";
import { executeSqlAction } from "./actions";
export default async function SqlConsolePage() {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session || session.user.role !== "SUPER_ADMIN") redirect("/login");
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Consola SQL</h1>
      <p>
        {env.ENABLE_SQL_CONSOLE
          ? "Solo consultas SELECT, máximo 100 filas."
          : "Consola deshabilitada por entorno."}
      </p>
      {env.ENABLE_SQL_CONSOLE && (
        <form action={executeSqlAction} className="grid gap-2">
          <label className="grid gap-1">
            Consulta SQL
            <textarea name="sql" required placeholder="SELECT ..." className="rounded border p-2" />
          </label>
          <button className="rounded bg-blue-700 p-2 text-white">Ejecutar</button>
        </form>
      )}
    </section>
  );
}
