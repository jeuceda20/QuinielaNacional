"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { z } from "zod";

import { SessionService } from "@/modules/auth/application/session-service";
import { UserLifecycleAction } from "@/modules/auth/domain/authorization-policies";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { ApproveUser } from "@/modules/users/application/approve-user";
import { ManageAdministratorRole } from "@/modules/users/application/manage-administrator-role";
import { ManageUserLifecycle } from "@/modules/users/application/manage-user-lifecycle";
import { PrismaAdministratorRoleRepository } from "@/modules/users/infrastructure/prisma-administrator-role-repository";
import { PrismaUserApprovalRepository } from "@/modules/users/infrastructure/prisma-user-approval-repository";
import { PrismaUserLifecycleRepository } from "@/modules/users/infrastructure/prisma-user-lifecycle-repository";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";

import { prisma } from "@/lib/prisma";

async function actor() {
  const token = (await cookies()).get("session")?.value;
  const session = token ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date()) : null;
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) throw new Error("No autorizado.");
  return session.user;
}

export async function adminUserAction(formData: FormData) {
  const current = await actor();
  const userId = String(formData.get("userId") ?? "");
  const action = String(formData.get("action") ?? "");
  const reason = String(formData.get("reason") ?? "") || null;
  const input = { actor: { id: current.id, role: current.role, status: current.status }, userId, reason };

  if (action === "APPROVE") {
    await new ApproveUser(new PrismaUserRepository(), new PrismaUserApprovalRepository()).execute({ ...input, addToActiveSeason: false }, new Date());
  } else if (action === "RESET_PASSWORD") {
    const password = z.string().min(12, "La contraseña temporal debe tener al menos 12 caracteres.").max(128).parse(formData.get("temporaryPassword"));
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, status: true } });
    if (!target || target.status !== "APPROVED" || (target.role === "SUPER_ADMIN" && current.role !== "SUPER_ADMIN")) throw new Error("No es posible restablecer esta cuenta.");
    const now = new Date();
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: await new Argon2PasswordHasher().hash(password) } });
    await prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: now } });
  } else if (["REJECT", "BLOCK", "UNBLOCK", "DISABLE", "ENABLE"].includes(action)) {
    await new ManageUserLifecycle(new PrismaUserRepository(), new PrismaUserLifecycleRepository()).execute({ ...input, action: action as UserLifecycleAction }, new Date());
  } else if (action === "PROMOTE" || action === "DEMOTE") {
    await new ManageAdministratorRole(new PrismaUserRepository(), new PrismaAdministratorRoleRepository()).execute({ ...input, newRole: action === "PROMOTE" ? "ADMIN" : "USER" }, new Date());
  } else throw new Error("Acción no válida.");
  revalidatePath("/admin/users");
}
