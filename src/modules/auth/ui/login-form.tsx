"use client";
import { useActionState } from "react";

import Link from "next/link";

import { loginAction } from "@/app/(public)/login/actions";

import { initialLoginActionState } from "./action-states";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialLoginActionState);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <label className="grid gap-2 text-sm font-medium">
        Correo electrónico
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>
      {state.message && (
        <p role="status" className="text-red-700">
          {state.message}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-md bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Iniciar sesión"}
      </button>
      <div className="flex flex-col gap-2 text-sm">
        <Link href="/forgot-password" className="text-blue-700">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link href="/register" className="text-blue-700">
          Crear una cuenta
        </Link>
      </div>
    </form>
  );
}
