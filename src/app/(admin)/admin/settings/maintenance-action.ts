"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

import { prisma } from "@/lib/prisma";
export async function setMaintenanceAction(formData: FormData) {
  const token = (await cookies()).get("session")?.value,
    session = token
      ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
      : null;
  if (!session || session.user.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");
  const enabled = formData.get("enabled") === "true";
  const previous = await prisma.applicationSetting.findUnique({
    where: { key: "APPLICATION_MAINTENANCE_MODE" },
    select: { valueJson: true },
  });
  await prisma.applicationSetting.upsert({
    where: { key: "APPLICATION_MAINTENANCE_MODE" },
    create: {
      key: "APPLICATION_MAINTENANCE_MODE",
      valueJson: enabled,
      isPublic: true,
      updatedById: session.user.id,
    },
    update: { valueJson: enabled, isPublic: true, updatedById: session.user.id },
  });
  await prisma.auditLog.create({
    data: {
      actorUserId: session.user.id,
      actorRole: "SUPER_ADMIN",
      action: enabled ? "MAINTENANCE_ENABLED" : "MAINTENANCE_DISABLED",
      entityType: "SETTING",
      beforeJson: { enabled: previous?.valueJson ?? false },
      afterJson: { enabled },
    },
  });
  revalidatePath("/", "layout");
}
