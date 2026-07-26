"use server";

import { redirect } from "next/navigation";

import {
  InitialSetup,
  InitialSetupError,
  initialSetupSchema,
} from "@/modules/auth/application/initial-setup";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaInitialSetupRepository } from "@/modules/auth/infrastructure/prisma-initial-setup-repository";

import { env } from "@/lib/env/server";

export async function initialSetupAction(formData: FormData) {
  const parsed = initialSetupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/setup?error=invalid");
  try {
    await new InitialSetup(
      new PrismaInitialSetupRepository(),
      new Argon2PasswordHasher(),
      env.INITIAL_SETUP_TOKEN,
    ).execute(parsed.data, new Date());
  } catch (error) {
    if (error instanceof InitialSetupError)
      redirect(`/setup?error=${error.code === "INVALID_SETUP_TOKEN" ? "token" : "completed"}`);
    throw error;
  }
  redirect("/login?setup=complete");
}
