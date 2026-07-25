import type { NextRequest } from "next/server";

import { type SessionRecord, SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

export async function getApiSession(request: NextRequest): Promise<SessionRecord | null> {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;
  return new SessionService(new PrismaSessionRepository()).validate(token, new Date());
}

export function hasApiRole(
  session: SessionRecord,
  allowedRoles: readonly SessionRecord["user"]["role"][],
) {
  return allowedRoles.includes(session.user.role);
}
