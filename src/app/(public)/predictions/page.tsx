import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { GetPendingPredictions } from "@/modules/predictions/application/get-pending-predictions";
import { disablePrivatePredictionCache } from "@/modules/predictions/infrastructure/prediction-cache";
import { PrismaPendingPredictionRepository } from "@/modules/predictions/infrastructure/prisma-pending-prediction-repository";
import { PredictionForm } from "@/modules/predictions/ui/prediction-form";
export default async function PredictionsPage() {
  disablePrivatePredictionCache();
  const t = (await cookies()).get("session")?.value,
    s = t ? await new SessionService(new PrismaSessionRepository()).validate(t, new Date()) : null;
  if (!s) redirect("/login");
  const matches = await new GetPendingPredictions(new PrismaPendingPredictionRepository()).execute(
    s.user.id,
    new Date(),
  );
  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Mis pronósticos pendientes</h1>
      {matches.length ? (
        matches.map((m) => (
          <PredictionForm
            key={m.id}
            match={{
              id: m.id,
              home: m.homeTeam.name,
              away: m.awayTeam.name,
              double: m.isDoublePoints,
              scheduledAt: m.scheduledAt.toISOString(),
              closesAt: m.predictionClosesAt.toISOString(),
            }}
          />
        ))
      ) : (
        <p role="status" className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-gray-300 shadow-xl">
          No tienes pronósticos pendientes.
        </p>
      )}
    </section>
  );
}
