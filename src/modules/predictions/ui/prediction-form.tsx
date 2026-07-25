"use client";

import { useState } from "react";

import { savePredictionAction } from "@/app/(public)/predictions/actions";

type PredictionFormMatch = {
  id: string;
  home: string;
  away: string;
  double: boolean;
  closesAt: string;
};

export function PredictionForm({ match }: Readonly<{ match: PredictionFormMatch }>) {
  const [message, setMessage] = useState("");

  return (
    <form
      action={async (formData) => {
        try {
          await savePredictionAction(formData);
          setMessage("Pronóstico guardado.");
        } catch {
          setMessage("No fue posible guardar el pronóstico.");
        }
      }}
      className="grid gap-3 rounded-lg border p-4"
    >
      <div className="flex items-center justify-between">
        <strong>
          {match.home} vs {match.away}
        </strong>
        {match.double && (
          <span className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold">Doble</span>
        )}
      </div>
      <p className="text-sm text-slate-600">
        Cierra: {new Date(match.closesAt).toLocaleString("es-HN")}
      </p>
      <input type="hidden" name="matchId" value={match.id} />
      <div className="grid grid-cols-2 gap-3">
        <label>
          Local
          <input
            name="homeGoals"
            type="number"
            min="0"
            max="20"
            required
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        <label>
          Visitante
          <input
            name="awayGoals"
            type="number"
            min="0"
            max="20"
            required
            className="mt-1 w-full rounded border p-2"
          />
        </label>
      </div>
      <button className="rounded bg-blue-700 p-2 font-semibold text-white">
        Guardar pronóstico
      </button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}
