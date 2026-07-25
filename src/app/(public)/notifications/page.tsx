import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { NotificationService } from "@/modules/notifications/application/notification-service";
import { PrismaNotificationRepository } from "@/modules/notifications/infrastructure/prisma-notification-repository";

import { notificationAction } from "./actions";
export default async function NotificationsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ page?: string }> }>) {
  const token = (await cookies()).get("session")?.value,
    session = token
      ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
      : null;
  if (!session) redirect("/login");
  const page = Math.max(Number((await searchParams).page) || 1, 1),
    notifications = await new NotificationService(new PrismaNotificationRepository()).list(
      session.user.id,
      page,
    );
  return (
    <section className="w-full space-y-4">
      <h1 className="text-2xl font-bold">Notificaciones</h1>
      <form action={notificationAction}>
        <button name="action" value="all" className="rounded border px-3 py-2">
          Marcar todas como leídas
        </button>
      </form>
      {notifications.length ? (
        notifications.map((notification) => (
          <article key={notification.id} className="rounded bg-white p-4 shadow">
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
            {!notification.readAt && (
              <form action={notificationAction} className="mt-2">
                <input type="hidden" name="notificationId" value={notification.id} />
                <button className="text-blue-700">Marcar como leída</button>
              </form>
            )}
          </article>
        ))
      ) : (
        <p role="status">No tienes notificaciones.</p>
      )}
      <a href={`/notifications?page=${page + 1}`} className="text-blue-700">
        Siguiente página
      </a>
    </section>
  );
}
