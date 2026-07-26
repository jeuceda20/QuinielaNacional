import Link from "next/link";

import type {
  AdminDirectoryUser,
  AdminUserFilters,
} from "@/modules/users/infrastructure/prisma-admin-user-directory";

import { adminUserAction } from "@/app/(admin)/admin/users/actions";

const labels: Record<AdminDirectoryUser["status"], string> = {
  PENDING_EMAIL_CONFIRMATION: "Correo pendiente",
  PENDING_APPROVAL: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  BLOCKED: "Bloqueado",
  DISABLED: "Desactivado",
};
export function AdminUsersTable({
  users,
  total,
  page,
  filters,
  actorRole,
}: Readonly<{
  users: AdminDirectoryUser[];
  total: number;
  page: number;
  filters: AdminUserFilters;
  actorRole: "ADMIN" | "SUPER_ADMIN";
}>) {
  const pages = Math.max(1, Math.ceil(total / 25));
  return (
    <section className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-sm text-gray-400">
          Gestiona cuentas sin exponer credenciales ni sesiones.
        </p>
      </div>
      <form className="grid gap-3 rounded-2xl border border-yellow-400/25 bg-gray-900 p-4 shadow-xl sm:grid-cols-4">
        <input
          name="q"
          defaultValue={filters.query}
          placeholder="Buscar usuario"
          className="rounded-xl border border-gray-800 p-2"
          aria-label="Buscar usuario"
        />
        <select name="status" defaultValue={filters.status} className="rounded-xl border border-gray-800 p-2">
          <option value="">Todos los estados</option>
          {Object.entries(labels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select name="role" defaultValue={filters.role} className="rounded-xl border border-gray-800 p-2">
          <option value="">Todos los roles</option>
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
          <option value="SUPER_ADMIN">Superadministrador</option>
        </select>
        <select name="verified" defaultValue={filters.verified} className="rounded-xl border border-gray-800 p-2">
          <option value="">Correo: todos</option>
          <option value="yes">Confirmado</option>
          <option value="no">Sin confirmar</option>
        </select>
        <button className="rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-gray-950 hover:bg-yellow-300 sm:col-span-4">
          Aplicar filtros
        </button>
      </form>
      {users.length === 0 ? (
        <p role="status" className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-gray-300 shadow-xl">
          No se encontraron usuarios con esos filtros.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-950 text-gray-300">
              <tr>
                {[
                  "Nickname",
                  "Nombre",
                  "Correo",
                  "Equipo",
                  "Estado",
                  "Rol",
                  "Registro",
                  "Confirmación",
                  "Temporada",
                  "Detalle",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-800">
                  <td className="px-3 py-3">{u.nickname}</td>
                  <td className="px-3 py-3">{u.fullName}</td>
                  <td className="px-3 py-3">{u.email}</td>
                  <td className="px-3 py-3">{u.team ?? "—"}</td>
                  <td className="px-3 py-3">{labels[u.status]}</td>
                  <td className="px-3 py-3">{u.role}</td>
                  <td className="px-3 py-3">{u.createdAt.toLocaleDateString("es-HN")}</td>
                  <td className="px-3 py-3">
                    {u.emailVerifiedAt?.toLocaleDateString("es-HN") ?? "—"}
                  </td>
                  <td className="px-3 py-3">{u.activeSeason ?? "—"}</td>
                  <td className="px-3 py-3">
                    <details>
                      <summary className="cursor-pointer text-yellow-300">Ver detalle</summary>
                      <p className="mt-2">ID: {u.id}</p>
                      <p>Acciones disponibles según su estado y tu rol.</p>
                      <form action={adminUserAction} className="mt-2 grid gap-2">
                        <input type="hidden" name="userId" value={u.id} />
                        <input
                          name="reason"
                          aria-label={`Motivo para ${u.nickname}`}
                          placeholder="Motivo"
                          className="rounded border border-gray-800 p-1"
                        />
                        {u.status === "PENDING_APPROVAL" && (
                          <>
                            <button
                              name="action"
                              value="APPROVE"
                              className="text-left text-blue-700"
                            >
                              Aprobar
                            </button>
                            <button name="action" value="REJECT" className="text-left text-red-700">
                              Rechazar
                            </button>
                          </>
                        )}
                        {u.status === "APPROVED" && (
                          <>
                            <input
                              name="temporaryPassword"
                              type="password"
                              minLength={12}
                              placeholder="Contraseña temporal (12+)"
                              className="rounded border border-gray-800 p-1"
                            />
                            <button name="action" value="RESET_PASSWORD" className="text-left text-amber-300">
                              Restablecer contraseña
                            </button>
                            <button name="action" value="BLOCK" className="text-left text-red-700">
                              Bloquear
                            </button>
                            <button
                              name="action"
                              value="DISABLE"
                              className="text-left text-red-700"
                            >
                              Desactivar
                            </button>
                          </>
                        )}
                        {u.status === "BLOCKED" && (
                          <button name="action" value="UNBLOCK" className="text-left text-blue-700">
                            Desbloquear
                          </button>
                        )}
                        {u.status === "DISABLED" && (
                          <button name="action" value="ENABLE" className="text-left text-blue-700">
                            Reactivar
                          </button>
                        )}
                        {actorRole === "SUPER_ADMIN" &&
                          u.status === "APPROVED" &&
                          u.role === "USER" && (
                            <button
                              name="action"
                              value="PROMOTE"
                              className="text-left text-blue-700"
                            >
                              Promover a administrador
                            </button>
                          )}
                        {actorRole === "SUPER_ADMIN" &&
                          u.status === "APPROVED" &&
                          u.role === "ADMIN" && (
                            <button name="action" value="DEMOTE" className="text-left text-red-700">
                              Retirar administrador
                            </button>
                          )}
                      </form>
                      {actorRole === "SUPER_ADMIN" && (
                        <p>Puede gestionarse su rol cuando aplique.</p>
                      )}
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <nav aria-label="Paginación" className="flex justify-between">
        <span>{total} usuarios</span>
        {page > 1 ? (
          <Link
          className="text-yellow-300"
            href={`?${new URLSearchParams({
              ...Object.fromEntries(
                Object.entries(filters)
                  .filter(([, v]) => v !== undefined)
                  .map(([k, v]) => [k === "query" ? "q" : k, String(v)]),
              ),
              page: String(page - 1),
            })}`}
          >
            Anterior
          </Link>
        ) : (
          <span />
        )}
        {page < pages ? (
          <Link className="text-yellow-300" href={`?page=${page + 1}`}>
            Siguiente
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </section>
  );
}
