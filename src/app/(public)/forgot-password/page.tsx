import { ForgotPasswordForm } from "@/modules/auth/ui/forgot-password-form";

export default function ForgotPasswordPage() {
  return <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/30 sm:p-8"><p className="text-sm font-semibold text-cyan-300">RECUPERACIÓN DE ACCESO</p><h1 className="mt-2 text-2xl font-bold">Recupera tu contraseña</h1><p className="mt-2 text-sm text-gray-400">Escribe tu correo y te enviaremos un enlace seguro para crear una nueva contraseña.</p><div className="mt-8"><ForgotPasswordForm /></div></section>;
}
