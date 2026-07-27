import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SessionService } from "@/modules/auth/application/session-service";
import {
  AuthorizationAccountStatus,
  AuthorizationRole,
  canUseDiagnostics,
} from "@/modules/auth/domain/authorization-policies";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { DiagnosticRunHistory } from "@/modules/diagnostics/application/diagnostic-run-history";
import { DiagnosticErrorViewer } from "@/modules/diagnostics/application/error-viewer";
import { GetSystemStatus } from "@/modules/diagnostics/application/get-system-status";
import { PrismaDiagnosticErrorViewRepository } from "@/modules/diagnostics/infrastructure/prisma-diagnostic-error-view-repository";
import { PrismaDiagnosticRunHistoryRepository } from "@/modules/diagnostics/infrastructure/prisma-diagnostic-run-history-repository";
import { PrismaSystemStatusRepository } from "@/modules/diagnostics/infrastructure/prisma-system-status-repository";

import { env } from "@/lib/env/server";

import { runIntegrityCheckAction } from "./actions";

export default async function DiagnosticsPage() {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const diagnosticsEnabled = canUseDiagnostics(
    {
      role: session.user.role as AuthorizationRole,
      status: session.user.status as AuthorizationAccountStatus,
    },
    env.ENABLE_DIAGNOSTICS,
  );
  const [systemStatus, runs, errors] = await Promise.all([
    new GetSystemStatus(new PrismaSystemStatusRepository(), {
      version: process.env.npm_package_version ?? "0.1.0",
      environment: env.NODE_ENV,
      diagnosticsEnabled,
    }).execute(),
    new DiagnosticRunHistory(new PrismaDiagnosticRunHistoryRepository()).list(1, 10),
    new DiagnosticErrorViewer(new PrismaDiagnosticErrorViewRepository()).list(1, 10),
  ]);

  return (
    <section className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Centro de diagnostico</h1>
        <p className="text-sm text-slate-600">Estado operativo y verificaciones de consistencia.</p>
      </div>

      <div className="grid gap-3 rounded bg-white p-4 shadow sm:grid-cols-2 lg:grid-cols-3">
        <StatusItem label="Aplicacion" value={systemStatus.application} />
        <StatusItem label="Base de datos" value={systemStatus.database} />
        <StatusItem
          label="Diagnosticos"
          value={systemStatus.diagnosticsEnabled ? "HABILITADOS" : "DESHABILITADOS"}
        />
      </div>

      <div className="rounded bg-white p-4 shadow">
        <h2 className="font-semibold">Verificacion de integridad</h2>
        <p className="mt-1 text-sm text-slate-600">
          Revisa temporadas, administradores, partidos dobles, predicciones, puntos, tabla y
          resultados.
        </p>
        {diagnosticsEnabled ? (
          <form action={runIntegrityCheckAction} className="mt-3">
            <button className="rounded bg-blue-700 px-3 py-2 font-semibold text-white">
              Ejecutar verificacion
            </button>
          </form>
        ) : (
          <p role="status" className="mt-3 text-sm text-amber-700">
            Los diagnosticos estan deshabilitados por configuracion del entorno.
          </p>
        )}
      </div>

      <section className="rounded bg-white p-4 shadow">
        <h2 className="font-semibold">Ultimas ejecuciones</h2>
        {runs.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Aun no hay ejecuciones registradas.</p>
        ) : (
          <ul className="mt-2 divide-y text-sm">
            {runs.map((run) => (
              <li key={run.id} className="py-2">
                <span className="font-medium">{run.type}</span> · {run.status} ·{" "}
                {run.startedAt.toLocaleString("es-HN")}
                {run.requestId && <span className="text-slate-600"> · {run.requestId}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded bg-white p-4 shadow">
        <h2 className="font-semibold">Errores recientes</h2>
        {errors.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No hay errores diagnosticados.</p>
        ) : (
          <ul className="mt-2 divide-y text-sm">
            {errors.map((error) => (
              <li key={error.id} className="py-2">
                <p className="font-medium">{error.diagnosticType}</p>
                <p className="text-red-700">{error.message}</p>
                <p className="text-slate-600">{error.occurredAt.toLocaleString("es-HN")}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

function StatusItem({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
