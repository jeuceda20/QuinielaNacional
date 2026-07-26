import { LoginForm } from "@/modules/auth/ui/login-form";
export default async function LoginPage({ searchParams }: Readonly<{ searchParams: Promise<{ registered?: string }> }>) {
  const { registered } = await searchParams;
  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/30 sm:p-8">
      <p className="text-sm font-semibold text-cyan-300">QUINIELA NACIONAL</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Inicia sesión</h1>
      <p className="mt-2 text-sm text-gray-400">Accede a tu cuenta de Quiniela Nacional.</p>
      {registered === "1" && <p role="status" className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">Solicitud creada con éxito. Un administrador debe aprobar tu acceso antes de iniciar sesión.</p>}
      <div className="mt-8">
        <LoginForm />
      </div>
    </section>
  );
}
