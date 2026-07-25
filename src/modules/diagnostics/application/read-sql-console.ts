const forbidden =
  /\b(insert|update|delete|drop|alter|create|grant|revoke|copy|call|execute|truncate|vacuum|analyze)\b/i;
export const SQL_ROW_LIMIT = 100;
export const SQL_TIMEOUT_MS = 5_000;
export interface ReadSqlRepository {
  query(sql: string, timeoutMs: number): Promise<readonly Record<string, unknown>[]>;
  audit(sql: string, actorUserId: string, requestId: string): Promise<void>;
}

export function validateReadOnlySql(sql: string): string {
  const normalized = sql.trim().replace(/;$/, "");
  if (!/^select\b/i.test(normalized) || forbidden.test(normalized) || /;/.test(normalized))
    throw new Error("Solo se permiten consultas SELECT de una sola sentencia.");
  return /\blimit\b/i.test(normalized) ? normalized : `${normalized} LIMIT ${SQL_ROW_LIMIT}`;
}

export async function executeReadSql(
  repository: ReadSqlRepository,
  sql: string,
  actorUserId: string,
  requestId: string,
): Promise<readonly Record<string, unknown>[]> {
  const safeSql = validateReadOnlySql(sql);
  const rows = await repository.query(safeSql, SQL_TIMEOUT_MS);
  await repository.audit(safeSql, actorUserId, requestId);
  return rows;
}
