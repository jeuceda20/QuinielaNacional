"use client";
import { useState } from "react";

import { recalculateSeasonAction } from "@/app/(admin)/admin/seasons/recalculate-action";
export function RecalculateSeasonForm({
  seasonId,
  standingCount,
}: Readonly<{ seasonId: string; standingCount: number }>) {
  const [processing, setProcessing] = useState(false),
    [message, setMessage] = useState("");
  return (
    <section className="mt-4 rounded border border-amber-200 bg-amber-50 p-3">
      <h3 className="font-semibold">Vista previa de recálculo</h3>
      <p className="text-sm">
        Se reconstruirán {standingCount} posiciones actuales desde resultados oficiales.
      </p>
      <form
        action={async (data) => {
          if (!window.confirm("Este proceso reconstruirá toda la clasificación. ¿Continuar?"))
            return;
          setProcessing(true);
          setMessage("");
          try {
            const result = await recalculateSeasonAction(data);
            setMessage(
              `Completado: ${result.matches} partidos, ${result.scores} puntuaciones, ${result.standings} posiciones, ${result.durationMilliseconds} ms. Solicitud ${result.requestId}.`,
            );
          } catch {
            setMessage("No fue posible completar el recálculo.");
          } finally {
            setProcessing(false);
          }
        }}
        className="mt-3"
      >
        <input type="hidden" name="seasonId" value={seasonId} />
        <button
          disabled={processing}
          className="rounded bg-amber-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {processing ? "Reconstruyendo..." : "Confirmar recálculo"}
        </button>
        {message && (
          <p role="status" className="mt-2 text-sm">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
