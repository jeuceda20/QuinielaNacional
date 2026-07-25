import type {
  NotificationInput,
  NotificationRepository,
} from "@/modules/notifications/application/notification-service";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";
export class PrismaNotificationRepository implements NotificationRepository {
  public constructor(private readonly database: Pick<PrismaClient, "notification"> = prisma) {}
  async create(input: NotificationInput) {
    await this.database.notification.create({ data: { ...input, link: input.link ?? null } });
  }
  async markAsRead(userId: string, notificationId: string, now: Date) {
    const result = await this.database.notification.updateMany({
      where: { id: notificationId, userId, readAt: null },
      data: { readAt: now },
    });
    return result.count === 1;
  }
}
