"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { UserLifecycleAction } from "@/modules/auth/domain/authorization-policies";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { GmailSmtpEmailProvider } from "@/modules/email/infrastructure/gmail-smtp-email-provider";
import { RateLimitedEmailProvider } from "@/modules/email/infrastructure/rate-limited-email-provider";
import { RateLimiter } from "@/modules/security/application/rate-limiter";
import { PrismaRateLimitRepository } from "@/modules/security/infrastructure/prisma-rate-limit-repository";
import { ApproveUser } from "@/modules/users/application/approve-user";
import { ManageAdministratorRole } from "@/modules/users/application/manage-administrator-role";
import { ManageUserLifecycle } from "@/modules/users/application/manage-user-lifecycle";
import { PrismaAdministratorRoleRepository } from "@/modules/users/infrastructure/prisma-administrator-role-repository";
import { PrismaUserApprovalRepository } from "@/modules/users/infrastructure/prisma-user-approval-repository";
import { PrismaUserLifecycleRepository } from "@/modules/users/infrastructure/prisma-user-lifecycle-repository";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";

import { env } from "@/lib/env/server";

async function actor() {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN"))
    throw new Error("No autorizado.");
  return session.user;
}
export async function adminUserAction(formData: FormData) {
  const current = await actor();
  const userId = String(formData.get("userId") ?? "");
  const action = String(formData.get("action") ?? "");
  const reason = String(formData.get("reason") ?? "") || null;
  const input = {
    actor: { id: current.id, role: current.role, status: current.status },
    userId,
    reason,
  };
  if (action === "APPROVE")
    await new ApproveUser(
      new PrismaUserRepository(),
      new PrismaUserApprovalRepository(),
      new RateLimitedEmailProvider(
        new GmailSmtpEmailProvider({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          user: env.SMTP_USER,
          appPassword: env.SMTP_APP_PASSWORD,
          appUrl: env.APP_URL,
        }),
        new RateLimiter(new PrismaRateLimitRepository()),
      ),
    ).execute({ ...input, addToActiveSeason: false }, new Date());
  else if (["REJECT", "BLOCK", "UNBLOCK", "DISABLE", "ENABLE"].includes(action))
    await new ManageUserLifecycle(
      new PrismaUserRepository(),
      new PrismaUserLifecycleRepository(),
    ).execute({ ...input, action: action as UserLifecycleAction }, new Date());
  else if (action === "PROMOTE" || action === "DEMOTE")
    await new ManageAdministratorRole(
      new PrismaUserRepository(),
      new PrismaAdministratorRoleRepository(),
    ).execute({ ...input, newRole: action === "PROMOTE" ? "ADMIN" : "USER" }, new Date());
  else throw new Error("Acción no válida.");
  revalidatePath("/admin/users");
}
