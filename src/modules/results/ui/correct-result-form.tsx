"use client";

import { useState } from "react";

import { correctResultAction } from "@/app/(admin)/admin/matches/correct-result-action";

type Props = Readonly<{ matchId: string; homeGoals: number; awayGoals: number }>;

export function CorrectResultForm({ matchId, homeGoals, awayGoals }: Props) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <details className="text-xs">
      <summary className="cursor-pointer text-yellow-300">Corregir resultado</summary>
      <form
        className="mt-2 grid gap-2 rounded border border-yellow-400/25 bg-gray-950 p-2"
        action={async (formData) => {
          if (!window.confirm("Se recalculará la tabla oficial. ¿Deseas continuar?")) return;
          setPending(true);
          setMessage("");
          try {
            await correctResultAction(formData);
            setMessage("Resultado corregido y tabla recalculada.");
          } catch {
            setMessage("No se pudo corregir. Verifica tu contraseña y el motivo.");
          } finally {
            setPending(false);
          }
        }}
      >
        <input type="hidden" name="matchId" value={matchId} />
        <div className="grid grid-cols-2 gap-2">
          <input name="homeGoals" type="number" min="0" defaultValue={homeGoals} required disabled={pending} className="rounded border border-gray-800 p-1" aria-label="Goles local corregidos" />
          <input name="awayGoals" type="number" min="0" defaultValue={awayGoals} required disabled={pending} className="rounded border border-gray-800 p-1" aria-label="Goles visitante corregidos" />
        </div>
        <input name="reason" minLength={3} required placeholder="Motivo de la corrección" disabled={pending} className="rounded border border-gray-800 p-1" />
        <input name="password" type="password" required placeholder="Tu contraseña" autoComplete="current-password" disabled={pending} className="rounded border border-gray-800 p-1" />
        <button disabled={pending} className="rounded bg-yellow-400 px-2 py-1 font-semibold text-gray-950 disabled:opacity-60">
          {pending ? "Corrigiendo..." : "Guardar corrección"}
        </button>
        {message && <p role="status" className="text-gray-300">{message}</p>}
      </form>
    </details>
  );
}
