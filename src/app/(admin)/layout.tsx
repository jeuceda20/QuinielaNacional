import Link from "next/link";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-950 text-white">
      <header className="border-b border-yellow-400/25 bg-gray-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-300">Zona de control</p>
            <h1 className="font-bold">Panel de administración</h1>
          </div>
          <nav aria-label="Navegación de administración" className="flex flex-wrap items-center gap-1 text-sm font-medium">
            <Link href="/admin/matches" className="rounded-full px-3 py-2 hover:bg-yellow-400/10">Partidos</Link>
            <Link href="/admin/seasons" className="rounded-full px-3 py-2 hover:bg-yellow-400/10">Jornadas</Link>
            <Link href="/admin/users" className="rounded-full px-3 py-2 hover:bg-yellow-400/10">Usuarios</Link>
            <Link href="/dashboard" className="rounded-full border border-gray-700 px-3 py-2 text-gray-300 hover:border-yellow-300 hover:text-yellow-200">Volver al inicio</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
