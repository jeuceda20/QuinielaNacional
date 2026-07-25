import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getApiSession } from "@/lib/api/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  const user = await prisma.user.findFirst({
    where: { id: session.user.id, deletedAt: null },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickname: true,
      email: true,
      role: true,
      favoriteTeam: { select: { id: true, name: true, logoPath: true } },
    },
  });
  if (!user) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  return apiSuccess(user);
}
