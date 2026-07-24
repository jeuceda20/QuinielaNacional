"use client";

import { useActionState } from "react";

import Link from "next/link";

import {
  initialResetPasswordActionState,
  resetPasswordAction,
} from "@/app/(public)/reset-password/actions";

export function ResetPasswordForm({ token }: Readonly<{ token: string }>) {
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    initialResetPasswordActionState,
  );
  const error = (field: string) => state.fieldErrors?.[field]?.[0];
  if (state.success) {
    return (
      <div className="grid gap-5">
        <p role="status" className="text-green-700">
          {state.message}
        </p>
        <Link href="/login" className="font-medium text-blue-700">
          Iniciar sesiÃ³n
        </Link>
      </div>
    );
  }
  return (
    <form action={action} className="grid gap-5" noValidate>
      <input name="token" type="hidden" value={token} />
      <PasswordField label="Nueva contraseÃ±a" name="password" error={error("password")} />
      <PasswordField
        label="Confirmar nueva contraseÃ±a"
        name="passwordConfirmation"
        error={error("passwordConfirmation")}
      />
      {state.message && (
        <p role="status" className="text-red-700">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Actualizandoâ€¦" : "Actualizar contraseÃ±a"}
      </button>
    </form>
  );
}

function PasswordField({
  label,
  name,
  error,
}: Readonly<{ label: string; name: string; error?: string }>) {
  const errorId = `${name}-error`;
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        type="password"
        autoComplete="new-password"
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="rounded-md border border-slate-300 px-3 py-2"
      />
      {error && (
        <span id={errorId} className="text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}
