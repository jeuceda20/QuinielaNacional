import type {
  IntegrityRepository,
  IntegritySnapshot,
} from "@/modules/diagnostics/application/integrity-checker";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

const EMPTY_SNAPSHOT: IntegritySnapshot = {
  activeSeasons: 0,
  activeSuperAdmins: 0,
  roundsWithoutExactlyOneDouble: 0,
  duplicatePredictions: 0,
  standingsWithIncorrectPoints: 0,
  standingsWithoutEligibleParticipant: 0,
  processedMatchesWithoutCurrentResult: 0,
  cancelledMatchesWithCurrentResult: 0,
};

export class PrismaIntegrityRepository implements IntegrityRepository {
  public constructor(private readonly database: Pick<PrismaClient, "$queryRaw"> = prisma) {}

  async getSnapshot(): Promise<IntegritySnapshot> {
    const [snapshot] = await this.database.$queryRaw<IntegritySnapshot[]>`
      SELECT
        (SELECT count(*)::int FROM "Season" WHERE status = 'ACTIVE' AND "archivedAt" IS NULL) AS "activeSeasons",
        (SELECT count(*)::int FROM "User" WHERE role = 'SUPER_ADMIN' AND status = 'APPROVED' AND "deletedAt" IS NULL) AS "activeSuperAdmins",
        (SELECT count(*)::int FROM (
          SELECT r.id
          FROM "Round" r
          LEFT JOIN "Match" m ON m."roundId" = r.id AND m."isDoublePoints" = true AND m."archivedAt" IS NULL
          WHERE r.status IN ('PUBLISHED', 'IN_PROGRESS', 'COMPLETED') AND r."archivedAt" IS NULL
          GROUP BY r.id
          HAVING count(m.id) <> 1
        ) invalid_rounds) AS "roundsWithoutExactlyOneDouble",
        (SELECT count(*)::int FROM (
          SELECT "userId", "matchId" FROM "Prediction" WHERE "deletedAt" IS NULL
          GROUP BY "userId", "matchId" HAVING count(*) > 1
        ) duplicate_predictions) AS "duplicatePredictions",
        (SELECT count(*)::int FROM "Standing" st
          LEFT JOIN (
            SELECT ps."seasonId", ps."userId", sum(ps."awardedPoints")::int AS total
            FROM "PredictionScore" ps
            JOIN "Match" m ON m.id = ps."matchId"
            WHERE m.status = 'PROCESSED' AND ps."resultVersion" = m."resultVersion"
            GROUP BY ps."seasonId", ps."userId"
          ) totals ON totals."seasonId" = st."seasonId" AND totals."userId" = st."userId"
          WHERE st."totalPoints" <> coalesce(totals.total, 0)
        ) AS "standingsWithIncorrectPoints",
        (SELECT count(*)::int FROM "Standing" st WHERE NOT EXISTS (
          SELECT 1 FROM "SeasonParticipant" sp
          WHERE sp."seasonId" = st."seasonId" AND sp."userId" = st."userId"
            AND sp."isEligible" = true AND sp."excludedAt" IS NULL
        )) AS "standingsWithoutEligibleParticipant",
        (SELECT count(*)::int FROM "Match" m WHERE m.status = 'PROCESSED' AND NOT EXISTS (
          SELECT 1 FROM "MatchResult" mr WHERE mr."matchId" = m.id AND mr."isCurrent" = true AND mr.version = m."resultVersion"
        )) AS "processedMatchesWithoutCurrentResult",
        (SELECT count(*)::int FROM "Match" m WHERE m.status = 'CANCELLED' AND EXISTS (
          SELECT 1 FROM "MatchResult" mr WHERE mr."matchId" = m.id AND mr."isCurrent" = true
        )) AS "cancelledMatchesWithCurrentResult"
    `;

    return snapshot ?? EMPTY_SNAPSHOT;
  }
}
