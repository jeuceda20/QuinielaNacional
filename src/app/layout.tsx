import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { SessionService } from "@/modules/auth/application/session-service";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";

import { prisma } from "@/lib/prisma";

import "@/lib/env/server";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Quiniela Nacional",
    template: "%s | Quiniela Nacional",
  },
  description: "Pronostica resultados y sigue la quiniela nacional.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setting = await prisma.applicationSetting.findUnique({
    where: { key: "APPLICATION_MAINTENANCE_MODE" },
    select: { valueJson: true },
  });
  if (setting?.valueJson === true) {
    const token = (await cookies()).get("session")?.value,
      session = token
        ? await new SessionService(new PrismaSessionRepository()).validate(token, new Date())
        : null;
    if (session?.user.role !== "SUPER_ADMIN") redirect("/maintenance");
  }
  return (
    <html lang="es-HN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
