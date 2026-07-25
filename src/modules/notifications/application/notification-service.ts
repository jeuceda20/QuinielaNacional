import { z } from "zod";

export const notificationInputSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum([
    "ACCOUNT_APPROVED",
    "MATCH_RESCHEDULED",
    "MATCH_SUSPENDED",
    "MATCH_CANCELLED",
    "MATCH_PROCESSED",
  ]),
  title: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(1000),
  link: z.string().max(500).nullable().optional(),
});
export type NotificationInput = z.infer<typeof notificationInputSchema>;
export type UserNotification = Readonly<{
  id: string;
  title: string;
  message: string;
  link: string | null;
  readAt: Date | null;
  createdAt: Date;
}>;
export interface NotificationRepository {
  create(input: NotificationInput): Promise<void>;
  markAsRead(userId: string, notificationId: string, now: Date): Promise<boolean>;
  markAllAsRead(userId: string, now: Date): Promise<void>;
  list(userId: string, page: number, pageSize: number): Promise<readonly UserNotification[]>;
}
export class NotificationService {
  public constructor(private readonly repository: NotificationRepository) {}
  create(input: NotificationInput) {
    return this.repository.create(notificationInputSchema.parse(input));
  }
  async markAsRead(userId: string, notificationId: string, now: Date) {
    if (!(await this.repository.markAsRead(userId, notificationId, now)))
      throw new Error("NOTIFICATION_NOT_FOUND");
  }
  markAllAsRead(userId: string, now: Date) {
    return this.repository.markAllAsRead(userId, now);
  }
  list(userId: string, page: number, pageSize = 20) {
    return this.repository.list(userId, Math.max(page, 1), pageSize);
  }
}
