import type { NextRequest } from "next/server";

import { z } from "zod";

import { createCsvExportArtifact } from "@/modules/exports/application/create-csv-export";
import { CreateJsonExport } from "@/modules/exports/application/create-json-export";
import { PrismaJsonExportRunRepository, PrismaJsonExportSource } from "@/modules/exports/infrastructure/prisma-json-export";

import { apiError } from "@/lib/api/response";
import { getApiSession, hasApiRole } from "@/lib/api/session";
import { prisma } from "@/lib/prisma";
import { createRequestId } from "@/lib/request-id";

const typeSchema = z.enum(["backup-json", "users", "matches", "predictions", "standings"]);
type ExportType = z.infer<typeof typeSchema>;
type RouteContext = Readonly<{ params: Promise<{ type: string }> }>;

function download(content: string, filename: string, contentType: string) {
  return new Response(content, {
    headers: {
      "content-type": `${contentType}; charset=utf-8`,
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}

async function recordCsvExport(actorUserId: string, exportType: string, rowCount: number, checksum: string, requestId: string) {
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await tx.exportRun.create({ data: { requestedById: actorUserId, exportType, format: "csv", status: "SUCCEEDED", rowCount, summaryJson: { checksum }, requestId, startedAt: now, completedAt: now } });
    await tx.auditLog.create({ data: { actorUserId, actorRole: "SUPER_ADMIN", action: "DATA_EXPORTED", entityType: "SYSTEM", metadataJson: { exportType, format: "csv", checksum, rowCount }, requestId } });
  });
}

async function csvRows(type: Exclude<ExportType, "backup-json">) {
  if (type === "users") {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, nickname: true, firstName: true, lastName: true, email: true, role: true, status: true, emailVerifiedAt: true, createdAt: true, favoriteTeam: { select: { name: true } } } });
    return users.map(({ favoriteTeam, ...user }) => ({ ...user, favoriteTeam: favoriteTeam?.name ?? "" }));
  }
  if (type === "matches") {
    const matches = await prisma.match.findMany({ orderBy: { scheduledAt: "asc" }, select: { id: true, scheduledAt: true, predictionClosesAt: true, status: true, isDoublePoints: true, officialHomeGoals: true, officialAwayGoals: true, season: { select: { name: true } }, round: { select: { name: true, sequence: true } }, homeTeam: { select: { name: true } }, awayTeam: { select: { name: true } } } });
    return matches.map(({ season, round, homeTeam, awayTeam, ...match }) => ({ ...match, season: season.name, round: round.name, roundSequence: round.sequence, homeTeam: homeTeam.name, awayTeam: awayTeam.name }));
  }
  if (type === "predictions") {
    const predictions = await prisma.prediction.findMany({ where: { deletedAt: null }, orderBy: { submittedAt: "asc" }, select: { id: true, homeGoals: true, awayGoals: true, submittedAt: true, user: { select: { nickname: true } }, scores: { select: { awardedPoints: true, scoreType: true }, orderBy: { resultVersion: "desc" }, take: 1 }, match: { select: { homeTeam: { select: { name: true } }, awayTeam: { select: { name: true } }, round: { select: { name: true } } } } } });
    return predictions.map(({ user, match, scores, ...prediction }) => ({ ...prediction, nickname: user.nickname, homeTeam: match.homeTeam.name, awayTeam: match.awayTeam.name, round: match.round.name, awardedPoints: scores[0]?.awardedPoints ?? "", scoreType: scores[0]?.scoreType ?? "" }));
  }
  const standings = await prisma.standing.findMany({ orderBy: [{ seasonId: "asc" }, { position: "asc" }], select: { position: true, previousPosition: true, totalPoints: true, exactCount: true, partialCount: true, doublePoints: true, season: { select: { name: true } }, user: { select: { nickname: true } } } });
  return standings.map(({ season, user, ...standing }) => ({ ...standing, season: season.name, nickname: user.nickname }));
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await getApiSession(request);
  if (!session) return apiError(401, "AUTH_SESSION_EXPIRED", "La sesión no es válida.");
  if (!hasApiRole(session, ["SUPER_ADMIN"])) return apiError(403, "FORBIDDEN", "Solo el superadministrador puede exportar datos.");
  const parsed = typeSchema.safeParse((await params).type);
  if (!parsed.success) return apiError(404, "NOT_FOUND", "La exportación solicitada no existe.");
  const requestId = request.headers.get("x-request-id") ?? createRequestId();

  if (parsed.data === "backup-json") {
    const artifact = await new CreateJsonExport(new PrismaJsonExportSource(), new PrismaJsonExportRunRepository()).execute(session.user.id, requestId);
    return download(artifact.content, `quiniela-respaldo-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
  }

  const artifact = createCsvExportArtifact(await csvRows(parsed.data));
  await recordCsvExport(session.user.id, parsed.data.toUpperCase(), artifact.rowCount, artifact.checksum, requestId);
  return download(artifact.content, `quiniela-${parsed.data}-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
}
