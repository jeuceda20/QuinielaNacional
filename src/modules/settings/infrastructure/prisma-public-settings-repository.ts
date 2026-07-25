import type { PublicSettings } from "@/modules/settings/application/public-settings";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaPublicSettingsRepository {
  public constructor(
    private readonly database: Pick<PrismaClient, "applicationSetting"> = prisma,
  ) {}
  async get(): Promise<Partial<PublicSettings>> {
    const rows = await this.database.applicationSetting.findMany({
      where: {
        isPublic: true,
        key: {
          in: [
            "APPLICATION_NAME",
            "APPLICATION_LOGO_PATH",
            "APPLICATION_HOW_IT_WORKS",
            "APPLICATION_SOCIAL_LINKS",
            "APPLICATION_REGISTRATION_ENABLED",
          ],
        },
      },
    });
    const values = new Map(rows.map((row) => [row.key, row.valueJson]));
    return {
      name: values.get("APPLICATION_NAME") as string | undefined,
      logoPath: values.get("APPLICATION_LOGO_PATH") as string | null | undefined,
      howItWorks: values.get("APPLICATION_HOW_IT_WORKS") as string | undefined,
      socialLinks: values.get("APPLICATION_SOCIAL_LINKS") as Record<string, string> | undefined,
      registrationEnabled: values.get("APPLICATION_REGISTRATION_ENABLED") as boolean | undefined,
    };
  }
}
