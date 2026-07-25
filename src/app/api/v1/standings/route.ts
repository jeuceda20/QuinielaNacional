import { GetPublicStandings } from "@/modules/standings/application/get-public-standings";
import { PrismaPublicStandingsRepository } from "@/modules/standings/infrastructure/prisma-public-standings-repository";

import { apiSuccess } from "@/lib/api/response";

export async function GET() {
  const standings = await new GetPublicStandings(new PrismaPublicStandingsRepository()).execute();
  return apiSuccess(standings);
}
