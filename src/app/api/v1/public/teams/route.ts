import { PrismaTeamRepository } from "@/modules/sports/infrastructure/prisma-sports-repositories";

import { apiSuccess } from "@/lib/api/response";

export async function GET() {
  const teams = await new PrismaTeamRepository().listActive();
  return apiSuccess(
    teams.map(({ id, name, shortName, slug, logoPath }) => ({
      id,
      name,
      shortName,
      slug,
      logoPath,
    })),
  );
}
