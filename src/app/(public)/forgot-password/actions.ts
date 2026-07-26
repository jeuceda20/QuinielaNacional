"use server";

import type { ForgotPasswordActionState } from "@/modules/auth/ui/action-states";

export async function forgotPasswordAction(_: ForgotPasswordActionState): Promise<ForgotPasswordActionState> {
  return { success: true, message: "La recuperación por correo está desactivada. Solicita una contraseña temporal al administrador." };
}
