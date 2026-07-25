import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { LogoutUser } from "@/modules/auth/application/logout-user";
import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

export async function POST(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  await new LogoutUser(new SessionService(new PrismaSessionRepository()), {
    clear: async () => {
      response.cookies.set("session", "", { httpOnly: true, maxAge: 0, path: "/" });
    },
  }).execute(request.cookies.get("session")?.value ?? null, new Date());
  return response;
}
