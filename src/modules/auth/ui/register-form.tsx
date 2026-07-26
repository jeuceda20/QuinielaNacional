"use client";

import { useActionState } from "react";

import Link from "next/link";

import { initialRegisterActionState } from "./action-states";

import { registerAction } from "@/app/(public)/register/actions";

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
      <label className="grid gap-2 text-sm font-medium text-gray-200">
        Equipo favorito
        <select
          name="favoriteTeamId"
          required
          className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
        >
          <option value="">Selecciona un equipo</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        {error("favoriteTeamId") && <span className="text-red-300">{error("favoriteTeamId")}</span>}
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
      <p className="-mt-3 text-xs text-gray-400">
        La contraseña debe tener entre 12 y 128 caracteres. Usa una frase larga que no reutilices en otros sitios.
      </p>
      <label className="flex items-start gap-3 text-sm text-gray-300">
        <input name="acceptedRules" type="checkbox" required className="mt-1 size-4 accent-blue-600" />
        Acepto las reglas de la quiniela.
      </label>
      {state.message && (
        <p role="status" className={state.success ? "text-emerald-300" : "text-red-300"}>
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
      >
        {pending ? "Registrando…" : "Crear cuenta"}
      </button>
      <p className="text-sm text-gray-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
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
    <label className="grid gap-2 text-sm font-medium text-gray-200">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
        aria-invalid={Boolean(error)}
      />
      {error && <span className="text-red-300">{error}</span>}
    </label>
  );
}
