import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <section className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 text-center shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Tu cuenta está pendiente de aprobación</h1>
      <p className="mt-3 text-slate-600">
        Tu correo ya fue confirmado. Un administrador debe aprobar tu cuenta antes de que puedas
        acceder. Te notificaremos cuando corresponda.
      </p>
      <p className="mt-3 text-sm text-slate-500">Todavía no puedes iniciar sesión.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md border border-slate-300 px-4 py-3 font-semibold"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
