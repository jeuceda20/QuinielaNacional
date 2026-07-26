"use client";

import { useActionState } from "react";

import Link from "next/link";

import { forgotPasswordAction } from "@/app/(public)/forgot-password/actions";
import { initialForgotPasswordActionState } from "./action-states";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    forgotPasswordAction,
    initialForgotPasswordActionState,
  );
  return (
    <form action={action} className="grid gap-5" noValidate>
      <label className="grid gap-2 text-sm font-medium">
        Correo electrÃ³nico
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(state.emailError)}
          aria-describedby={state.emailError ? "email-error" : undefined}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        {state.emailError && (
          <span id="email-error" className="text-red-700">
            {state.emailError}
          </span>
        )}
      </label>
      {state.message && (
        <p role="status" className={state.success ? "text-green-700" : "text-red-700"}>
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Enviandoâ€¦" : "Enviar instrucciones"}
      </button>
      <Link href="/login" className="text-sm font-medium text-blue-700">
        Volver a iniciar sesiÃ³n
      </Link>
    </form>
  );
}
