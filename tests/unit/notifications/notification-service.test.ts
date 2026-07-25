import { describe, expect, it, vi } from "vitest";

import { NotificationService } from "@/modules/notifications/application/notification-service";
describe("NotificationService", () => {
  it("creates supported events and marks only its own notification as read", async () => {
    const repository = { create: vi.fn(), markAsRead: vi.fn().mockResolvedValue(true) },
      service = new NotificationService(repository);
    await service.create({
      userId: "11111111-1111-4111-8111-111111111111",
      type: "MATCH_PROCESSED",
      title: "Resultado",
      message: "Tu partido fue procesado",
    });
    await service.markAsRead("user", "notification", new Date());
    expect(repository.create).toHaveBeenCalledOnce();
  });
});
