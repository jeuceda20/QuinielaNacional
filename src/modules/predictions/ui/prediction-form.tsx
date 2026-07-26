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
      className="grid gap-4 rounded-2xl border border-cyan-400/30 bg-gray-900 p-5 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <strong>
          {match.home} vs {match.away}
        </strong>
        {match.double && (
          <span className="rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-200">Doble</span>
        )}
      </div>
      <p className="text-sm text-gray-400">
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
            className="mt-1 w-full rounded-xl border border-gray-800 p-2"
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
            className="mt-1 w-full rounded-xl border border-gray-800 p-2"
          />
        </label>
      </div>
      <button className="rounded-xl bg-blue-600 p-2 font-semibold text-white hover:bg-blue-500">
        Guardar pronóstico
      </button>
      {message && <p role="status" className="text-sm text-cyan-200">{message}</p>}
    </form>
  );
}
