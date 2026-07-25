import Link from "next/link";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6"
        >
          <Link href="/" className="font-semibold tracking-tight text-slate-900">
            Quiniela Nacional
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium">
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
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Quiniela Nacional</span>
          <Link href="/" className="w-fit hover:text-slate-900">
            Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
}
