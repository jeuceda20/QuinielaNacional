"use client";

import { useActionState } from "react";

import { changePasswordAction } from "./actions";

const initial = { success: false, message: "" };
export default function ChangePasswordPage() {
  const [state, action, pending] = useActionState(changePasswordAction, initial);
  return <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/30 sm:p-8"><p className="text-sm font-semibold text-cyan-300">SEGURIDAD</p><h1 className="mt-2 text-2xl font-bold">Cambiar contraseña</h1><p className="mt-2 text-sm text-gray-400">Si el administrador te entregó una contraseña temporal, reemplázala aquí.</p><form action={action} className="mt-8 grid gap-5"><label className="grid gap-2 text-sm font-medium text-gray-200">Nueva contraseña<input name="password" type="password" minLength={10} required className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white" /></label><label className="grid gap-2 text-sm font-medium text-gray-200">Confirmar contraseña<input name="passwordConfirmation" type="password" minLength={10} required className="rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white" /></label><p className="-mt-3 text-xs text-gray-400">Usa entre 10 y 128 caracteres.</p>{state.message && <p role="status" className={state.success ? "text-emerald-300" : "text-red-300"}>{state.message}</p>}<button disabled={pending} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Guardando…" : "Actualizar contraseña"}</button></form></section>;
}
