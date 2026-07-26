import Link from "next/link";

import { ResetPasswordForm } from "@/modules/auth/ui/reset-password-form";

type Props = Readonly<{ searchParams: Promise<{ token?: string }> }>;
export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) return <section className="mx-auto w-full max-w-md rounded-2xl border border-red-400/30 bg-gray-900 p-6 shadow-xl sm:p-8"><p className="text-sm font-semibold text-red-300">ENLACE NO VÁLIDO</p><h1 className="mt-2 text-2xl font-bold">No pudimos abrir este enlace</h1><p className="mt-2 text-sm text-gray-400">Puede haber expirado o ya fue utilizado. Solicita un enlace nuevo para continuar.</p><Link href="/forgot-password" className="mt-6 inline-block font-medium text-cyan-300 hover:text-cyan-200">Solicitar nuevas instrucciones</Link></section>;
  return <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/30 sm:p-8"><p className="text-sm font-semibold text-cyan-300">NUEVA CONTRASEÑA</p><h1 className="mt-2 text-2xl font-bold">Protege tu cuenta</h1><p className="mt-2 text-sm text-gray-400">Crea una contraseña nueva de al menos 12 caracteres. Al guardarla se cerrarán tus sesiones activas.</p><div className="mt-8"><ResetPasswordForm token={token} /></div></section>;
}
