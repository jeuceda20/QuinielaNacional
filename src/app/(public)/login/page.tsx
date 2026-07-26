import { LoginForm } from "@/modules/auth/ui/login-form";
export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/30 sm:p-8">
      <p className="text-sm font-semibold text-cyan-300">QUINIELA NACIONAL</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Inicia sesión</h1>
      <p className="mt-2 text-sm text-gray-400">Accede a tu cuenta de Quiniela Nacional.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </section>
  );
}
