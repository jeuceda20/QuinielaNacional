import { redirect } from "next/navigation";

import {
  ConfirmEmail,
  InvalidEmailConfirmationTokenError,
} from "@/modules/auth/application/confirm-email";
import { PrismaEmailConfirmationRepository } from "@/modules/auth/infrastructure/prisma-email-confirmation-repository";

type Props = Readonly<{ searchParams: Promise<{ token?: string }> }>;

export default async function ConfirmEmailPage({ searchParams }: Props) {
  const token = (await searchParams).token ?? "";
  try {
    await new ConfirmEmail(new PrismaEmailConfirmationRepository()).execute(token, new Date());
  } catch (error) {
    if (error instanceof InvalidEmailConfirmationTokenError) redirect("/verify-email?status=invalid");
    throw error;
  }
  redirect("/verify-email?status=confirmed");
}
