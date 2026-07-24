import Link from "next/link";

type VerifyEmailPageProps = Readonly<{ searchParams: Promise<{ status?: string }> }>;

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const status = (await searchParams).status;
  const confirmed = status === "confirmed";
  return (
    <section className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 text-center shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">
        {confirmed ? "Tu correo fue confirmado" : "Confirma tu correo"}
      </h1>
      <p className="mt-3 text-slate-600">
        {confirmed
          ? "Tu cuenta está pendiente de aprobación."
          : "El enlace no es válido o ha expirado."}
      </p>
      {confirmed ? (
        <Link
          href="/pending-approval"
          className="mt-6 inline-block rounded-md bg-blue-700 px-4 py-3 font-semibold text-white"
        >
          Ver estado de aprobación
        </Link>
      ) : (
        <Link
          href="/register"
          className="mt-6 inline-block rounded-md bg-blue-700 px-4 py-3 font-semibold text-white"
        >
          Solicitar un nuevo enlace
        </Link>
      )}
    </section>
  );
}
