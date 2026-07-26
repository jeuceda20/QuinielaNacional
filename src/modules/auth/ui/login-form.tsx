"use client";

import { useActionState } from "react";

import Link from "next/link";

import { initialLoginActionState } from "./action-states";

import { loginAction } from "@/app/(public)/login/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialLoginActionState);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <label className="grid gap-2 text-sm font-medium text-gray-200">
        Correo electrónico
        <input name="email" type="email" autoComplete="email" required className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white outline-none transition focus:border-cyan-400" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-gray-200">
        Contraseña
        <input name="password" type="password" autoComplete="current-password" required className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white outline-none transition focus:border-cyan-400" />
      </label>
      {state.message && <p role="status" className={state.status === "PENDING_APPROVAL" ? "text-amber-200" : "text-red-300"}>{state.message}</p>}
      <button disabled={pending} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">
        {pending ? "Ingresando…" : "Iniciar sesión"}
      </button>
      <div className="flex flex-col gap-2 text-sm">
        <p className="text-gray-400">¿Olvidaste tu contraseña? Solicita al administrador una contraseña temporal.</p>
        <Link href="/register" className="text-cyan-300 hover:text-cyan-200">Crear una cuenta</Link>
      </div>
    </form>
  );
}
