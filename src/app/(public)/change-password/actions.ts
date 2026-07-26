"use server";

import { cookies } from "next/headers";

import { z } from "zod";

import { SessionService } from "@/modules/auth/application/session-service";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

import { prisma } from "@/lib/prisma";

const schema = z.object({ password: z.string().min(12, "Usa al menos 12 caracteres."), passwordConfirmation: z.string() }).refine((value) => value.password === value.passwordConfirmation, { path: ["passwordConfirmation"], message: "Las contraseñas no coinciden." });

export async function changePasswordAction(_: { success: boolean; message: string }, formData: FormData) {
  const parsed = schema.safeParse({ password: formData.get("password"), passwordConfirmation: formData.get("passwordConfirmation") });
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  const token = (await cookies()).get("session")?.value;
  const session = token ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date()) : null;
  if (!session) return { success: false, message: "Tu sesión ya no es válida." };
  await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash: await new Argon2PasswordHasher().hash(parsed.data.password), mustChangePassword: false } });
  return { success: true, message: "Tu contraseña fue actualizada." };
}
