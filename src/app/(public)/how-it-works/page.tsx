import { PrismaPublicSettingsRepository } from "@/modules/settings/infrastructure/prisma-public-settings-repository";
export default async function HowItWorksPage() {
  const settings = await new PrismaPublicSettingsRepository().get();
  return (
    <section className="w-full space-y-3">
      <h1 className="text-2xl font-bold">Cómo funciona</h1>
      <p>
        {settings.howItWorks ??
          "Regístrate, espera aprobación y registra tus pronósticos antes del cierre."}
      </p>
    </section>
  );
}
