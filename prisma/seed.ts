import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

import { ApplicationSettingKey, Prisma, PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local", quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const teams = [
  { name: "Olimpia", shortName: "Olimpia", slug: "olimpia", displayOrder: 1 },
  { name: "Motagua", shortName: "Motagua", slug: "motagua", displayOrder: 2 },
  { name: "Real España", shortName: "Real España", slug: "real-espana", displayOrder: 3 },
  { name: "Marathón", shortName: "Marathón", slug: "marathon", displayOrder: 4 },
  { name: "Victoria", shortName: "Victoria", slug: "victoria", displayOrder: 5 },
  { name: "Génesis", shortName: "Génesis", slug: "genesis", displayOrder: 6 },
  { name: "Juticalpa", shortName: "Juticalpa", slug: "juticalpa", displayOrder: 7 },
  { name: "Lobos UPNFM", shortName: "Lobos", slug: "lobos-upnfm", displayOrder: 8 },
  { name: "Olancho", shortName: "Olancho", slug: "olancho", displayOrder: 9 },
  { name: "Real Sociedad", shortName: "Real Sociedad", slug: "real-sociedad", displayOrder: 10 },
  { name: "Platense", shortName: "Platense", slug: "platense", displayOrder: 11 },
  { name: "Choloma", shortName: "Choloma", slug: "choloma", displayOrder: 12 },
];

type SeedSetting = {
  key: ApplicationSettingKey;
  valueJson: Prisma.InputJsonValue;
  description: string;
  isPublic: boolean;
};

const settings: SeedSetting[] = [
  {
    key: "APPLICATION_NAME",
    valueJson: "Quiniela Nacional La Goleada",
    description: "Nombre público de la aplicación.",
    isPublic: true,
  },
  {
    key: "APPLICATION_LOGO_PATH",
    valueJson: "",
    description: "Ruta pública del logo de la aplicación.",
    isPublic: true,
  },
  {
    key: "APPLICATION_MAINTENANCE_MODE",
    valueJson: false,
    description: "Indica si el mantenimiento está habilitado.",
    isPublic: true,
  },
  {
    key: "APPLICATION_HOW_IT_WORKS",
    valueJson: "Pronostica los marcadores de cada partido antes de su cierre.",
    description: "Texto público mínimo que explica la dinámica.",
    isPublic: true,
  },
  {
    key: "APPLICATION_SOCIAL_LINKS",
    valueJson: {},
    description: "Enlaces públicos de redes sociales.",
    isPublic: true,
  },
  {
    key: "DIAGNOSTICS_ENABLED",
    valueJson: false,
    description: "Activa herramientas de diagnóstico autorizadas.",
    isPublic: false,
  },
  {
    key: "DEFAULT_EXACT_POINTS",
    valueJson: 3,
    description: "Puntos por marcador exacto para nuevas temporadas.",
    isPublic: false,
  },
  {
    key: "DEFAULT_PARTIAL_POINTS",
    valueJson: 1,
    description: "Puntos por desenlace correcto para nuevas temporadas.",
    isPublic: false,
  },
  {
    key: "DEFAULT_WRONG_POINTS",
    valueJson: 0,
    description: "Puntos por pronóstico incorrecto para nuevas temporadas.",
    isPublic: false,
  },
  {
    key: "DEFAULT_DOUBLE_MULTIPLIER",
    valueJson: 2,
    description: "Multiplicador del partido doble para nuevas temporadas.",
    isPublic: false,
  },
  {
    key: "DEFAULT_PREDICTION_CLOSE_MINUTES",
    valueJson: 5,
    description: "Minutos antes del partido en que cierran los pronósticos.",
    isPublic: false,
  },
  {
    key: "DEFAULT_MAX_PREDICTION_GOALS",
    valueJson: 20,
    description: "Máximo de goles admitido en un pronóstico.",
    isPublic: false,
  },
];

try {
  await prisma.$transaction([
    ...teams.map((team) =>
      prisma.team.upsert({
        where: { slug: team.slug },
        update: { ...team, deletedAt: null, isActive: true },
        create: team,
      }),
    ),
    ...settings.map((setting) =>
      prisma.applicationSetting.upsert({
        where: { key: setting.key },
        update: setting,
        create: setting,
      }),
    ),
  ]);
} finally {
  await prisma.$disconnect();
}
