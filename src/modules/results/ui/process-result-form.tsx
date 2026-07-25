"use client";

import { useState } from "react";

import { processResultAction } from "@/app/(admin)/admin/matches/process-result-action";

export function ProcessResultForm({ matchId }: Readonly<{ matchId: string }>) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <form
      action={async (formData) => {
        if (!window.confirm("Este proceso actualizará la clasificación oficial. ¿Desea continuar?"))
          return;
        setIsProcessing(true);
        setMessage("");
        try {
          const result = await processResultAction(formData);
          setMessage(
            `Resultado procesado: ${result.predictionCount} pronósticos, ${result.durationMilliseconds} ms, solicitud ${result.requestId}.`,
          );
        } catch {
          setMessage(
            "No fue posible procesar el resultado. Verifica el estado del partido e inténtalo de nuevo.",
          );
        } finally {
          setIsProcessing(false);
        }
      }}
      className="grid gap-2"
    >
      <input type="hidden" name="matchId" value={matchId} />
      <label className="grid gap-1 text-xs">
        Goles local
        <input
          name="homeGoals"
          type="number"
          min="0"
          required
          disabled={isProcessing}
          className="rounded border p-1"
        />
      </label>
      <label className="grid gap-1 text-xs">
        Goles visitante
        <input
          name="awayGoals"
          type="number"
          min="0"
          required
          disabled={isProcessing}
          className="rounded border p-1"
        />
      </label>
      <button
        disabled={isProcessing}
        className="rounded bg-emerald-700 p-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isProcessing ? "Procesando..." : "Procesar resultado"}
      </button>
      {message && (
        <p role="status" className="text-xs">
          {message}
        </p>
      )}
    </form>
  );
}
