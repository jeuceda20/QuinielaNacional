import Link from "next/link";

import { PrismaPublicSettingsRepository } from "@/modules/settings/infrastructure/prisma-public-settings-repository";

const steps = [
  ["1. Crea y confirma tu cuenta", "Regístrate con tu correo, abre el enlace de confirmación y espera la aprobación del administrador."],
  ["2. Elige tus marcadores", "En Pronósticos encontrarás los partidos ordenados por día y jornada. Puedes guardar o cambiar tu pick hasta cinco minutos antes del inicio."],
  ["3. Sigue los cierres", "Cuando se acerque el cierre verás un aviso. Tras el cierre, los picks de la comunidad se revelan para que todos jueguen con las mismas reglas."],
  ["4. Suma puntos y compite", "Un resultado parcial vale 1 punto y un marcador exacto 3. El partido de la jornada vale doble. La tabla se actualiza al procesar cada resultado oficial."],
] as const;

export default async function HowItWorksPage() {
  const settings = await new PrismaPublicSettingsRepository().get();
  return <section className="mx-auto w-full max-w-4xl space-y-6"><div className="rounded-3xl border border-cyan-400/25 bg-gray-900 p-7 shadow-xl"><p className="text-sm font-semibold text-cyan-300">GUÍA RÁPIDA</p><h1 className="mt-2 text-3xl font-bold">Cómo funciona la quiniela</h1><p className="mt-3 max-w-2xl text-gray-400">Pronostica, compite y sigue cada jornada de la Liga Nacional con una tabla transparente para toda la comunidad.</p><Link href="/register" className="mt-6 inline-block rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500">Crear mi cuenta</Link></div><div className="grid gap-4 sm:grid-cols-2">{steps.map(([title, description]) => <article key={title} className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl"><h2 className="font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-gray-400">{description}</p></article>)}</div>{settings.howItWorks && <article className="rounded-2xl border border-yellow-400/25 bg-yellow-400/5 p-5"><h2 className="font-semibold text-yellow-200">Información de la administración</h2><p className="mt-2 text-sm text-gray-300">{settings.howItWorks}</p></article>}</section>;
}
