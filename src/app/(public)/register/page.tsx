import { RegisterForm } from "@/modules/auth/ui/register-form";
import { PrismaTeamRepository } from "@/modules/sports/infrastructure/prisma-sports-repositories";

export default async function RegisterPage() {
  const teams = await new PrismaTeamRepository().listActive();
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/30 sm:p-8">
      <p className="text-sm font-semibold text-cyan-300">QUINIELA NACIONAL</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Crea tu cuenta</h1>
      <p className="mt-2 text-sm text-gray-400">
        Completa tus datos para participar en la quiniela.
      </p>
      <div className="mt-8">
        <RegisterForm teams={teams} />
      </div>
    </section>
  );
}
