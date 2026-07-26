"use client";

import { useEffect, useState } from "react";

import { savePredictionAction } from "@/app/(public)/predictions/actions";

type PredictionFormMatch = Readonly<{
  id: string;
  phase: string;
  scheduledAt: string;
  closesAt: string;
  status: string;
  double: boolean;
  home: string;
  away: string;
  officialHomeGoals: number | null;
  officialAwayGoals: number | null;
  ownPrediction: Readonly<{ homeGoals: number; awayGoals: number }> | null;
}>;

function formatCountdown(minutes: number) {
  if (minutes >= 1440) return `${Math.floor(minutes / 1440)} d ${Math.ceil((minutes % 1440) / 60)} h`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
  return `${Math.max(0, minutes)} min`;
}

export function PredictionForm({ match }: Readonly<{ match: PredictionFormMatch }>) {
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [homeGoals, setHomeGoals] = useState(match.ownPrediction ? String(match.ownPrediction.homeGoals) : "");
  const [awayGoals, setAwayGoals] = useState(match.ownPrediction ? String(match.ownPrediction.awayGoals) : "");
  const [hasPick, setHasPick] = useState(Boolean(match.ownPrediction));
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const closesIn = Math.ceil((new Date(match.closesAt).getTime() - now) / 60_000);
  const editableStatus = ["SCHEDULED", "RESCHEDULED", "RESUMED"].includes(match.status);
  const isClosed = closesIn <= 0 || !editableStatus;
  const needsReminder = !isClosed && !hasPick && closesIn <= 60;
  const officialResult = match.officialHomeGoals !== null && match.officialAwayGoals !== null;
  const statusLabel = match.status === "PROCESSED" ? "Procesado" : isClosed ? "Partido cerrado" : hasPick ? "Pick guardado" : "Disponible";

  return (
    <form
      action={async (formData) => {
        try {
          await savePredictionAction(formData);
          setHasPick(true);
          setMessage("Pronóstico guardado.");
        } catch {
          setMessage("No fue posible guardar el pronóstico.");
        }
      }}
      className={`grid gap-4 rounded-2xl border p-5 shadow-xl ${match.status === "PROCESSED" ? "border-emerald-400/30 bg-gray-900" : isClosed ? "border-red-400/40 bg-red-400/5" : needsReminder ? "border-amber-400/50 bg-amber-400/5" : "border-cyan-400/30 bg-gray-900"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{match.phase}</p>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${match.status === "PROCESSED" ? "bg-emerald-400/10 text-emerald-200" : isClosed ? "bg-red-400/10 text-red-200" : needsReminder ? "bg-amber-400/10 text-amber-200" : "bg-cyan-400/10 text-cyan-200"}`}>{statusLabel}</span>
      </div>
      <div className="flex items-center justify-between gap-3 text-center font-semibold">
        <span className="w-2/5 text-right">{match.home}</span>
        <span className="text-gray-500">vs</span>
        <span className="w-2/5 text-left">{match.away}</span>
      </div>
      {match.double && <p className="text-center text-sm font-semibold text-yellow-200">🔥 Partido de la jornada x2</p>}
      <p className="text-center text-sm text-gray-400">{new Date(match.scheduledAt).toLocaleString("es-HN")}</p>
      {match.status !== "PROCESSED" && <p className={`rounded-xl border px-3 py-2 text-center text-sm font-semibold ${isClosed ? "border-red-400/40 bg-red-400/10 text-red-200" : needsReminder ? "border-amber-400/40 bg-amber-400/10 text-amber-200" : "border-cyan-400/25 bg-cyan-400/10 text-cyan-200"}`}>{isClosed ? "Partido cerrado" : `Cierra en ${formatCountdown(closesIn)}`}</p>}
      {needsReminder && <p className="rounded-xl bg-amber-400/10 p-3 text-sm text-amber-100">⏰ Falta menos de una hora. Guarda tu pronóstico antes del cierre.</p>}
      <input type="hidden" name="matchId" value={match.id} />
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <label className="grid gap-1 text-sm text-gray-300"><span className="truncate">{match.home}</span><input name="homeGoals" type="number" min="0" max="20" required value={homeGoals} onChange={(event) => setHomeGoals(event.target.value)} disabled={isClosed} className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-center text-xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-50" /></label>
        <span className="pb-3 text-xl text-gray-500">—</span>
        <label className="grid gap-1 text-sm text-gray-300"><span className="truncate">{match.away}</span><input name="awayGoals" type="number" min="0" max="20" required value={awayGoals} onChange={(event) => setAwayGoals(event.target.value)} disabled={isClosed} className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-center text-xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-50" /></label>
      </div>
      {officialResult && <p className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-center text-sm font-semibold text-emerald-200">Resultado oficial: {match.officialHomeGoals} - {match.officialAwayGoals}</p>}
      {!isClosed && <button className="rounded-xl bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-500">{hasPick ? "Actualizar pronóstico" : "Guardar pronóstico"}</button>}
      {message && <p role="status" className="text-sm text-cyan-200">{message}</p>}
    </form>
  );
}
