"use client";

import { useActionState } from "react";

import Link from "next/link";

import { initialForgotPasswordActionState } from "./action-states";

import { forgotPasswordAction } from "@/app/(public)/forgot-password/actions";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initialForgotPasswordActionState);
  return <form action={action} className="grid gap-5" noValidate><label className="grid gap-2 text-sm font-medium text-gray-200">Correo electrónico<input name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state.emailError)} aria-describedby={state.emailError ? "email-error" : undefined} className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white outline-none transition focus:border-cyan-400" />{state.emailError && <span id="email-error" className="text-red-300">{state.emailError}</span>}</label>{state.message && <p role="status" className={state.success ? "text-emerald-300" : "text-red-300"}>{state.message}</p>}<button type="submit" disabled={pending} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">{pending ? "Enviando…" : "Enviar instrucciones"}</button><p className="text-xs text-gray-500">Revisa también Spam. Por seguridad, el mensaje es el mismo aunque el correo no esté registrado.</p><Link href="/login" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">Volver a iniciar sesión</Link></form>;
}
