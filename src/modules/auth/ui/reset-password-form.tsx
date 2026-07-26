"use client";

import { useActionState } from "react";

import Link from "next/link";

import { initialResetPasswordActionState } from "./action-states";

import { resetPasswordAction } from "@/app/(public)/reset-password/actions";

export function ResetPasswordForm({ token }: Readonly<{ token: string }>) {
  const [state, action, pending] = useActionState(resetPasswordAction, initialResetPasswordActionState);
  const error = (field: string) => state.fieldErrors?.[field]?.[0];
  if (state.success) return <div className="grid gap-5"><p role="status" className="text-emerald-300">{state.message}</p><Link href="/login" className="font-medium text-cyan-300 hover:text-cyan-200">Iniciar sesión</Link></div>;
  return <form action={action} className="grid gap-5" noValidate><input name="token" type="hidden" value={token} /><PasswordField label="Nueva contraseña" name="password" error={error("password")} /><PasswordField label="Confirmar nueva contraseña" name="passwordConfirmation" error={error("passwordConfirmation")} />{state.message && <p role="status" className="text-red-300">{state.message}</p>}<button type="submit" disabled={pending} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">{pending ? "Actualizando…" : "Actualizar contraseña"}</button></form>;
}
function PasswordField({ label, name, error }: Readonly<{ label: string; name: string; error?: string }>) { const errorId = `${name}-error`; return <label className="grid gap-2 text-sm font-medium text-gray-200">{label}<input name={name} type="password" autoComplete="new-password" required aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white outline-none transition focus:border-cyan-400" />{error && <span id={errorId} className="text-red-300">{error}</span>}</label>; }
