"use client";
import { useActionState, useState } from "react";

import Link from "next/link";

import { initialLoginActionState } from "./action-states";

import { loginAction, resendConfirmationAction } from "@/app/(public)/login/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialLoginActionState);
  const [email, setEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <label className="grid gap-2 text-sm font-medium text-gray-200">
        Correo electrónico
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white outline-none transition focus:border-cyan-400"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-gray-200">
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white outline-none transition focus:border-cyan-400"
        />
      </label>
      {state.message && (
        <p role="status" className="text-red-300">
          {state.message}
        </p>
      )}
      {state.status === "PENDING_EMAIL_CONFIRMATION" && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          <p>Confirma tu correo antes de iniciar sesión.</p>
          <button
            type="button"
            disabled={resending}
            onClick={async () => {
              setResending(true);
              setResendMessage(await resendConfirmationAction(email));
              setResending(false);
            }}
            className="mt-2 font-semibold text-amber-200 hover:text-amber-100 disabled:opacity-60"
          >
            {resending ? "Enviando..." : "Reenviar correo de confirmación"}
          </button>
          {resendMessage && <p role="status" className="mt-2 text-amber-100">{resendMessage}</p>}
        </div>
      )}
      <button
        disabled={pending}
        className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Iniciar sesión"}
      </button>
      <div className="flex flex-col gap-2 text-sm">
        <Link href="/forgot-password" className="text-cyan-300 hover:text-cyan-200">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link href="/register" className="text-cyan-300 hover:text-cyan-200">
          Crear una cuenta
        </Link>
      </div>
    </form>
  );
}
