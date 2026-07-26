import Link from "next/link";

const highlights = [
  {
    title: "Haz tus pronósticos",
    description: "Registra cada marcador antes del cierre de los partidos.",
  },
  {
    title: "Sigue la clasificación",
    description: "Consulta puntos, aciertos y posiciones de toda la comunidad.",
  },
  {
    title: "Resultados transparentes",
    description: "Los resultados procesados muestran cómo se asignaron los puntos.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <Link href="/" className="font-semibold tracking-tight text-slate-900">
            Quiniela Nacional La Goleada
          </Link>
          <div className="flex flex-wrap items-center gap-1 text-sm font-medium sm:gap-3">
            <Link href="/standings" className="rounded-md px-3 py-2 hover:bg-slate-100">
              Clasificación
            </Link>
            <Link href="/results" className="rounded-md px-3 py-2 hover:bg-slate-100">
              Resultados
            </Link>
            <Link href="/login" className="rounded-md px-3 py-2 hover:bg-slate-100">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-800"
            >
              Registrarse
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl space-y-6">
          <p className="font-semibold text-blue-700">Liga Nacional de Honduras</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            La quiniela para vivir cada jornada con la comunidad.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Pronostica los marcadores, compite por la cima de la tabla y consulta los resultados
            oficiales de Quiniela Nacional La Goleada.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-md bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Crear mi cuenta
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-md border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-100"
            >
              Cómo funciona
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{highlight.title}</h2>
              <p className="mt-2 text-slate-600">{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
