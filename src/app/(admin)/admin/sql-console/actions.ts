"use server";
import { cookies } from "next/headers";
import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { executeReadSql } from "@/modules/diagnostics/application/read-sql-console";
import { PrismaReadSqlRepository } from "@/modules/diagnostics/infrastructure/prisma-read-sql-repository";
import { env } from "@/lib/env/server";
import { createRequestContext } from "@/lib/request-context";
export async function executeSqlAction(formData: FormData) {
  const token = (await cookies()).get("session")?.value;
  const session = token
    ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
    : null;
  if (!session || session.user.role !== "SUPER_ADMIN" || !env.ENABLE_SQL_CONSOLE)
    throw new Error("FORBIDDEN");
  const context = createRequestContext({ userId: session.user.id, role: session.user.role });
  await executeReadSql(
    new PrismaReadSqlRepository(),
    String(formData.get("sql") ?? ""),
    session.user.id,
    context.requestId,
  );
}
