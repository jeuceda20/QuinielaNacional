"use server";

import { z } from "zod";

import { createPasswordRecoveryService } from "@/modules/auth/infrastructure/create-auth-services";

const emailSchema = z.string().trim().email("Ingresa un correo electrÃ³nico vÃ¡lido.");
export type ForgotPasswordActionState = Readonly<{
  success: boolean;
  message: string;
  emailError?: string;
}>;
export const initialForgotPasswordActionState: ForgotPasswordActionState = {
  success: false,
  message: "",
};

export async function forgotPasswordAction(
  _: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa el correo ingresado.",
      emailError: parsed.error.issues[0]?.message,
    };
  }

  const result = await createPasswordRecoveryService(true).request(parsed.data, new Date());
  return { success: true, message: result.message };
}
