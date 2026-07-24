import { LoginForm } from "@/modules/auth/ui/login-form";
export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Inicia sesión</h1>
      <p className="mt-2 text-sm text-slate-600">Accede a tu cuenta de Quiniela Nacional.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </section>
  );
}
