import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { PrismaAdminUserDirectory } from "@/modules/users/infrastructure/prisma-admin-user-directory";
import { AdminUsersTable } from "@/modules/users/ui/admin-users-table";

type Props = Readonly<{ searchParams: Promise<Record<string, string | undefined>> }>;
export default async function AdminUsersPage({ searchParams }: Props) {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN"))
    redirect("/login");
  const params = await searchParams;
  const filters = {
    query: params.q,
    status: params.status,
    role: params.role,
    verified: params.verified,
    teamId: params.team,
    participation: params.participation,
    page: Number(params.page) || 1,
  };
  const result = await new PrismaAdminUserDirectory().list(filters);
  return (
    <AdminUsersTable
      users={result.users}
      total={result.total}
      page={result.page}
      filters={filters}
      actorRole={session.user.role}
    />
  );
}
