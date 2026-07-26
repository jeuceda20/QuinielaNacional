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
    <main className="flex min-h-full flex-1 flex-col bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-950">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <Link href="/" className="font-bold tracking-tight text-white">
            Quiniela Nacional La Goleada
          </Link>
          <div className="flex flex-wrap items-center gap-1 text-sm font-medium sm:gap-3">
            <Link href="/standings" className="rounded-full px-3 py-2 hover:bg-gray-800">
              Clasificación
            </Link>
            <Link href="/results" className="rounded-full px-3 py-2 hover:bg-gray-800">
              Resultados
            </Link>
            <Link href="/login" className="rounded-full px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-3 py-2 text-white hover:bg-blue-500"
            >
              Registrarse
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl space-y-6">
          <p className="font-semibold text-cyan-300">Liga Nacional de Honduras</p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            La quiniela para vivir cada jornada con la comunidad.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-gray-400">
            Pronostica los marcadores, compite por la cima de la tabla y consulta los resultados
            oficiales de Quiniela Nacional La Goleada.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-950/50 hover:bg-blue-500"
            >
              Crear mi cuenta
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 font-semibold text-gray-100 hover:border-gray-700 hover:bg-gray-800"
            >
              Cómo funciona
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg shadow-black/20"
            >
              <h2 className="text-lg font-semibold">{highlight.title}</h2>
              <p className="mt-2 text-gray-400">{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
