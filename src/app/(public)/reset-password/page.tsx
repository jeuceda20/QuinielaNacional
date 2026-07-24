import Link from "next/link";

import { ResetPasswordForm } from "@/modules/auth/ui/reset-password-form";

type ResetPasswordPageProps = Readonly<{ searchParams: Promise<{ token?: string }> }>;

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <section className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold">Enlace no vÃ¡lido</h1>
        <p className="mt-2 text-sm text-slate-600">El enlace no es vÃ¡lido o ha expirado.</p>
        <Link href="/forgot-password" className="mt-6 inline-block font-medium text-blue-700">
          Solicitar nuevas instrucciones
        </Link>
      </section>
    );
  }
  return (
    <section className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Crea una nueva contraseÃ±a</h1>
      <p className="mt-2 text-sm text-slate-600">Usa una contraseÃ±a de al menos 12 caracteres.</p>
      <div className="mt-8">
        <ResetPasswordForm token={token} />
      </div>
    </section>
  );
}
