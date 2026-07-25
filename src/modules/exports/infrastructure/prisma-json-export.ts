import type {
  JsonExportArtifact,
  JsonExportData,
  JsonExportRunRepository,
  JsonExportSource,
} from "@/modules/exports/application/create-json-export";

import { prisma } from "@/lib/prisma";

import { type PrismaClient, RunStatus } from "@/generated/prisma/client";

type ExportDatabase = Pick<
  PrismaClient,
  | "team"
  | "season"
  | "seasonParticipant"
  | "round"
  | "match"
  | "prediction"
  | "matchResult"
  | "standing"
  | "sponsor"
  | "applicationSetting"
  | "exportRun"
  | "auditLog"
>;

export class PrismaJsonExportSource implements JsonExportSource {
  public constructor(private readonly database: ExportDatabase = prisma) {}
  async read(): Promise<JsonExportData> {
    const [
      teams,
      seasons,
      participants,
      rounds,
      matches,
      predictions,
      results,
      standings,
      sponsors,
      settings,
    ] = await Promise.all([
      this.database.team.findMany({
        select: {
          id: true,
          name: true,
          shortName: true,
          slug: true,
          logoPath: true,
          displayOrder: true,
          isActive: true,
          deletedAt: true,
        },
      }),
      this.database.season.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          startsAt: true,
          endsAt: true,
          closedAt: true,
          exactPoints: true,
          partialPoints: true,
          wrongPoints: true,
          doubleMultiplier: true,
          predictionCloseMinutes: true,
          maxPredictionGoals: true,
          archivedAt: true,
        },
      }),
      this.database.seasonParticipant.findMany({
        select: {
          seasonId: true,
          userId: true,
          joinedAt: true,
          isEligible: true,
          excludedAt: true,
          exclusionReason: true,
          isTestData: true,
        },
      }),
      this.database.round.findMany({
        select: {
          id: true,
          seasonId: true,
          name: true,
          slug: true,
          sequence: true,
          status: true,
          description: true,
          publishedAt: true,
          archivedAt: true,
        },
      }),
      this.database.match.findMany({
        select: {
          id: true,
          seasonId: true,
          roundId: true,
          homeTeamId: true,
          awayTeamId: true,
          scheduledAt: true,
          predictionClosesAt: true,
          status: true,
          isDoublePoints: true,
          venue: true,
          officialHomeGoals: true,
          officialAwayGoals: true,
          resultVersion: true,
          archivedAt: true,
        },
      }),
      this.database.prediction.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          userId: true,
          matchId: true,
          homeGoals: true,
          awayGoals: true,
          submittedAt: true,
          lockedAt: true,
          source: true,
          isTestData: true,
        },
      }),
      this.database.matchResult.findMany({
        select: {
          id: true,
          matchId: true,
          homeGoals: true,
          awayGoals: true,
          version: true,
          isCurrent: true,
          correctionReason: true,
          createdAt: true,
        },
      }),
      this.database.standing.findMany({
        select: {
          seasonId: true,
          userId: true,
          position: true,
          previousPosition: true,
          totalPoints: true,
          exactCount: true,
          partialCount: true,
          wrongCount: true,
          noPredictionCount: true,
          matchesScored: true,
          version: true,
        },
      }),
      this.database.sponsor.findMany({
        select: {
          id: true,
          name: true,
          imagePath: true,
          targetUrl: true,
          isActive: true,
          displayOrder: true,
          startsAt: true,
          endsAt: true,
          deletedAt: true,
        },
      }),
      this.database.applicationSetting.findMany({
        where: { isPublic: true },
        select: { key: true, valueJson: true, description: true, isPublic: true },
      }),
    ]);
    return {
      teams,
      seasons,
      participants,
      rounds,
      matches,
      predictions,
      results,
      standings,
      sponsors,
      settings,
    };
  }
}

export class PrismaJsonExportRunRepository implements JsonExportRunRepository {
  public constructor(private readonly database: ExportDatabase = prisma) {}
  async start(actorUserId: string | null, requestId: string | null, startedAt: Date) {
    const run = await this.database.exportRun.create({
      data: {
        requestedById: actorUserId,
        exportType: "FULL_JSON",
        format: "json",
        status: RunStatus.RUNNING,
        requestId,
        startedAt,
      },
      select: { id: true },
    });
    return run.id;
  }
  async succeed(id: string, artifact: JsonExportArtifact, completedAt: Date) {
    await this.database.exportRun.update({
      where: { id },
      data: {
        status: RunStatus.SUCCEEDED,
        rowCount: artifact.rowCount,
        summaryJson: {
          format: artifact.format,
          version: artifact.version,
          checksum: artifact.checksum,
        },
        completedAt,
      },
    });
  }
  async fail(id: string, completedAt: Date) {
    await this.database.exportRun.update({
      where: { id },
      data: {
        status: RunStatus.FAILED,
        sanitizedError: "No fue posible generar la exportacion JSON.",
        completedAt,
      },
    });
  }
  async audit(actorUserId: string | null, requestId: string | null, artifact: JsonExportArtifact) {
    await this.database.auditLog.create({
      data: {
        actorUserId,
        actorRole: "SUPER_ADMIN",
        action: "DATA_EXPORTED",
        entityType: "SYSTEM",
        metadataJson: {
          format: artifact.format,
          version: artifact.version,
          checksum: artifact.checksum,
          rowCount: artifact.rowCount,
        },
        requestId,
      },
    });
  }
}
