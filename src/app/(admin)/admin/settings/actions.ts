"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { publicSettingsSchema } from "@/modules/settings/application/public-settings";

import { prisma } from "@/lib/prisma";

import { ApplicationSettingKey, Prisma } from "@/generated/prisma/client";

export async function savePublicSettings(formData: FormData) {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session || session.user.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");
  const settings = publicSettingsSchema.parse({
    name: formData.get("name"),
    logoPath: formData.get("logoPath") || null,
    howItWorks: formData.get("howItWorks"),
    socialLinks: JSON.parse(String(formData.get("socialLinks") || "{}")),
    registrationEnabled: formData.get("registrationEnabled") === "on",
  });
  const entries: readonly [ApplicationSettingKey, Prisma.InputJsonValue][] = [
    ["APPLICATION_NAME", settings.name],
    ["APPLICATION_LOGO_PATH", settings.logoPath ?? ""],
    ["APPLICATION_HOW_IT_WORKS", settings.howItWorks],
    ["APPLICATION_SOCIAL_LINKS", settings.socialLinks],
    ["APPLICATION_REGISTRATION_ENABLED", settings.registrationEnabled],
  ];
  for (const [key, value] of entries)
    await prisma.applicationSetting.upsert({
      where: { key },
      create: { key, valueJson: value, isPublic: true, updatedById: session.user.id },
      update: { valueJson: value, isPublic: true, updatedById: session.user.id },
    });
  await prisma.auditLog.create({
    data: {
      actorUserId: session.user.id,
      actorRole: "SUPER_ADMIN",
      action: "SETTINGS_UPDATED",
      entityType: "SETTING",
      metadataJson: { keys: entries.map(([key]) => key) },
    },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/how-it-works");
}
