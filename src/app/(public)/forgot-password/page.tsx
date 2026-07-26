import { ForgotPasswordForm } from "@/modules/auth/ui/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/30 sm:p-8">
      <h1 className="text-2xl font-bold">Recupera tu contraseÃ±a</h1>
      <p className="mt-2 text-sm text-gray-400">
        Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseÃ±a.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
