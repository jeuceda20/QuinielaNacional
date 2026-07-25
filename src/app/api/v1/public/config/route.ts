import { PrismaPublicSettingsRepository } from "@/modules/settings/infrastructure/prisma-public-settings-repository";

import { apiSuccess } from "@/lib/api/response";

export async function GET() {
  const settings = await new PrismaPublicSettingsRepository().get();
  return apiSuccess({
    applicationName: settings.name ?? "Quiniela Nacional La Goleada",
    logoPath: settings.logoPath ?? "/branding/logo.png",
    registrationEnabled: settings.registrationEnabled ?? true,
    maintenanceMode: false,
    timezone: "America/Tegucigalpa",
  });
}
