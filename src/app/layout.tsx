import type { Metadata } from "next";

import "@/lib/env/server";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Quiniela Nacional",
    template: "%s | Quiniela Nacional",
  },
  description: "Pronostica resultados y sigue la quiniela nacional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-HN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
