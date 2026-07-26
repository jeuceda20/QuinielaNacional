import { apiError } from "@/lib/api/response";

export async function POST(_request: Request) {
  return apiError(410, "AUTH_PASSWORD_RECOVERY_DISABLED", "La recuperación por correo está desactivada. Solicita una contraseña temporal al administrador.");
}
