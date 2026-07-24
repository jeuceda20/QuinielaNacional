import { RegisterForm } from "@/modules/auth/ui/register-form";
import { PrismaTeamRepository } from "@/modules/sports/infrastructure/prisma-sports-repositories";

export default async function RegisterPage() {
  const teams = await new PrismaTeamRepository().listActive();
  return (
    <section className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
      <p className="mt-2 text-sm text-slate-600">
        Completa tus datos para participar en la quiniela.
      </p>
      <div className="mt-8">
        <RegisterForm teams={teams} />
      </div>
    </section>
  );
}
