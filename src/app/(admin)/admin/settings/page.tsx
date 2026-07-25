import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { PrismaPublicSettingsRepository } from "@/modules/settings/infrastructure/prisma-public-settings-repository";

import { savePublicSettings } from "./actions";
export default async function SettingsPage() {
  const token = (await cookies()).get("session")?.value,
    session = token
      ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
      : null;
  if (!session || session.user.role !== "SUPER_ADMIN") redirect("/login");
  const settings = await new PrismaPublicSettingsRepository().get();
  return (
    <section className="w-full space-y-4">
      <h1 className="text-2xl font-bold">Configuración pública</h1>
      <form action={savePublicSettings} className="grid gap-3 rounded bg-white p-4">
        <label>
          Nombre
          <input
            name="name"
            defaultValue={settings.name ?? "Quiniela Nacional"}
            className="block w-full rounded border p-2"
          />
        </label>
        <label>
          Logo
          <input
            name="logoPath"
            defaultValue={settings.logoPath ?? ""}
            className="block w-full rounded border p-2"
          />
        </label>
        <label>
          Descripción
          <textarea
            name="howItWorks"
            defaultValue={settings.howItWorks ?? ""}
            className="block w-full rounded border p-2"
          />
        </label>
        <label>
          Redes (JSON)
          <textarea
            name="socialLinks"
            defaultValue={JSON.stringify(settings.socialLinks ?? {})}
            className="block w-full rounded border p-2"
          />
        </label>
        <label>
          <input
            name="registrationEnabled"
            type="checkbox"
            defaultChecked={settings.registrationEnabled !== false}
          />{" "}
          Registro habilitado
        </label>
        <button className="rounded bg-blue-700 p-2 text-white">Guardar</button>
      </form>
    </section>
  );
}
