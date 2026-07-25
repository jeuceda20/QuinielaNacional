"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { NotificationService } from "@/modules/notifications/application/notification-service";
import { PrismaNotificationRepository } from "@/modules/notifications/infrastructure/prisma-notification-repository";
async function userId() {
  const token = (await cookies()).get("session")?.value,
    session = token
      ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
      : null;
  if (!session) throw new Error("No autorizado.");
  return session.user.id;
}
export async function notificationAction(formData: FormData) {
  const service = new NotificationService(new PrismaNotificationRepository()),
    user = await userId(),
    now = new Date();
  if (formData.get("action") === "all") await service.markAllAsRead(user, now);
  else await service.markAsRead(user, String(formData.get("notificationId")), now);
  revalidatePath("/notifications");
}
