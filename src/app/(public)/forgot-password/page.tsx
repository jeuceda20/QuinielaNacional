import Link from "next/link";

export default function ForgotPasswordPage() {
  return <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/30 sm:p-8"><p className="text-sm font-semibold text-amber-300">ACCESO A LA CUENTA</p><h1 className="mt-2 text-2xl font-bold">Restablecimiento administrado</h1><p className="mt-2 text-sm text-gray-400">Esta quiniela no envía correos automáticos. Solicita al administrador una contraseña temporal y cámbiala después de iniciar sesión.</p><Link href="/login" className="mt-6 inline-block font-medium text-cyan-300 hover:text-cyan-200">Volver a iniciar sesión</Link></section>;
}
