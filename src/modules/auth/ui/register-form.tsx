"use client";

import { useActionState } from "react";

import Link from "next/link";

import { registerAction } from "@/app/(public)/register/actions";

import { initialRegisterActionState } from "./action-states";

type Team = Readonly<{ id: string; name: string }>;
export function RegisterForm({ teams }: Readonly<{ teams: readonly Team[] }>) {
  const [state, action, pending] = useActionState(registerAction, initialRegisterActionState);
  const error = (field: string) => state.fieldErrors?.[field]?.[0];
  return (
    <form action={action} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre" name="firstName" error={error("firstName")} />
        <Field label="Apellido" name="lastName" error={error("lastName")} />
      </div>
      <Field label="Nickname" name="nickname" error={error("nickname")} />
      <Field
        label="Correo electrónico"
        name="email"
        type="email"
        autoComplete="email"
        error={error("email")}
      />
      <label className="grid gap-2 text-sm font-medium">
        Equipo favorito
        <select
          name="favoriteTeamId"
          required
          className="rounded-md border border-slate-300 bg-white px-3 py-2"
        >
          <option value="">Selecciona un equipo</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        {error("favoriteTeamId") && <span className="text-red-700">{error("favoriteTeamId")}</span>}
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          error={error("password")}
        />
        <Field
          label="Confirmar contraseña"
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          error={error("passwordConfirmation")}
        />
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input name="acceptedRules" type="checkbox" required className="mt-1 size-4" />
        Acepto las reglas de la quiniela.
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
        {pending ? "Registrando…" : "Crear cuenta"}
      </button>
      <p className="text-sm text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-blue-700">
          Inicia sesión
        </Link>
        .
      </p>
    </form>
  );
}
function Field({
  label,
  name,
  type = "text",
  autoComplete,
  error,
}: Readonly<{
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}>) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="rounded-md border border-slate-300 px-3 py-2"
        aria-invalid={Boolean(error)}
      />
      {error && <span className="text-red-700">{error}</span>}
    </label>
  );
}
