import { GetPublicResults } from "@/modules/results/application/get-public-results";
import { PrismaPublicResultsRepository } from "@/modules/results/infrastructure/prisma-public-results-repository";

import { apiSuccess } from "@/lib/api/response";

export async function GET() {
  const results = await new GetPublicResults(new PrismaPublicResultsRepository()).execute();
  return apiSuccess(results);
}
