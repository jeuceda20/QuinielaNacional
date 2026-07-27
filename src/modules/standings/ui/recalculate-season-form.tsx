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
    <section className="mt-4 rounded-xl border border-yellow-400/30 bg-gray-950 p-4 text-gray-100 shadow-inner shadow-black/20">
      <h3 className="font-semibold text-yellow-200">Vista previa de recálculo</h3>
      <p className="mt-1 text-sm text-gray-300">
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
          className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-gray-950 transition hover:bg-yellow-300 disabled:opacity-60"
        >
          {processing ? "Reconstruyendo..." : "Confirmar recálculo"}
        </button>
        {message && (
          <p role="status" className="mt-2 text-sm text-cyan-200">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
