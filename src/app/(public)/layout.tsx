import Link from "next/link";
import { cookies } from "next/headers";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-950">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <Link href="/" className="font-bold tracking-tight text-white">
            Quiniela Nacional
          </Link>
          <div className="flex flex-wrap items-center gap-1 text-sm font-medium sm:gap-3">
            <Link href="/dashboard" className="rounded-full px-3 py-2 hover:bg-gray-800">
              Inicio
            </Link>
            <Link
              href="/predictions"
              className="rounded-full px-3 py-2 text-cyan-300 hover:bg-gray-800"
            >
              Pronósticos
            </Link>
            <Link href="/standings" className="rounded-full px-3 py-2 hover:bg-gray-800">
              Tabla
            </Link>
            {session && (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
              <Link
                href="/admin/seasons"
                className="rounded-full px-3 py-2 text-yellow-300 hover:bg-yellow-400/10"
              >
                Panel admin
              </Link>
            )}
            {session ? (
              <form action="/api/v1/auth/logout" method="post">
                <button className="rounded-full px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  Cerrar sesión
                </button>
              </form>
            ) : (
              <>
                <Link href="/login" className="rounded-full px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-blue-600 px-3 py-2 text-white hover:bg-blue-500"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Quiniela Nacional</span>
          <Link href="/" className="w-fit hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
}
