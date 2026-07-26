"use server";

import { redirect } from "next/navigation";

import { RegistrationError } from "@/modules/auth/application/register-user";
import {
  consumeRegistrationRateLimit,
  createRegistrationService,
} from "@/modules/auth/infrastructure/create-auth-services";
import { registerInputSchema } from "@/modules/auth/schemas/register-input";
import type { RegisterActionState } from "@/modules/auth/ui/action-states";

import { getRequestIpAddress } from "@/lib/request-metadata";

export async function registerAction(
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const parsed = registerInputSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
    favoriteTeamId: formData.get("favoriteTeamId"),
    acceptedRules: formData.get("acceptedRules") === "on",
  });
  if (!parsed.success)
    return {
      success: false,
      message: "Revisa los datos ingresados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  const now = new Date();
  if (!(await consumeRegistrationRateLimit(await getRequestIpAddress(), now)))
    return { success: false, message: "Demasiados intentos. Inténtalo nuevamente más tarde." };

  try {
    await createRegistrationService().execute(parsed.data, now);
    redirect("/login?registered=1");
  } catch (error) {
    if (error instanceof RegistrationError)
      return {
        success: false,
        message:
          error.code === "TEAM_UNAVAILABLE"
            ? "El equipo seleccionado no está disponible."
            : "El correo o nickname ya está en uso.",
      };
    return { success: false, message: "No fue posible completar el registro. Inténtalo nuevamente." };
  }
}
