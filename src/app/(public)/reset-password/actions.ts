"use server";

import { passwordResetSchema } from "@/modules/auth/application/password-recovery";
import { createPasswordRecoveryService } from "@/modules/auth/infrastructure/create-auth-services";
import type { ResetPasswordActionState } from "@/modules/auth/ui/action-states";

export async function resetPasswordAction(
  _: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  const parsed = passwordResetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los datos ingresados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const updated = await createPasswordRecoveryService(false).reset(parsed.data, new Date());
  return updated
    ? { success: true, message: "Tu contraseÃ±a fue actualizada. Inicia sesiÃ³n nuevamente." }
    : { success: false, message: "El enlace no es vÃ¡lido o ha expirado." };
}
