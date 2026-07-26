"use server";

import type { ResetPasswordActionState } from "@/modules/auth/ui/action-states";

export async function resetPasswordAction(_: ResetPasswordActionState): Promise<ResetPasswordActionState> {
  return { success: false, message: "La recuperación por correo está desactivada." };
}
