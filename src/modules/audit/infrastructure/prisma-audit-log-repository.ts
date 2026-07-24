import type {
  AuditJson,
  AuditLogRepository,
  CreateAuditLogEntry,
} from "@/modules/audit/domain/audit-log-repository";

import { prisma } from "@/lib/prisma";

import { AuditAction, AuditEntityType, Prisma, type PrismaClient } from "@/generated/prisma/client";

export type AuditLogRepositoryDatabase = Pick<PrismaClient, "auditLog">;

const sensitiveKey = /password|hash|token|secret|credential|cookie/i;

export function sanitizeAuditJson(value: AuditJson | undefined): AuditJson | undefined {
  if (value === undefined || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sanitizeAuditJson) as AuditJson;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !sensitiveKey.test(key))
      .map(([key, nested]) => [key, sanitizeAuditJson(nested)]),
  ) as AuditJson;
}

function toPrismaJson(value: AuditJson | undefined) {
  return value === null ? Prisma.JsonNull : value;
}

export class PrismaAuditLogRepository implements AuditLogRepository {
  public constructor(private readonly database: AuditLogRepositoryDatabase = prisma) {}
  public async create(entry: CreateAuditLogEntry): Promise<void> {
    await this.database.auditLog.create({
      data: {
        ...entry,
        action: AuditAction[entry.action as keyof typeof AuditAction],
        entityType: AuditEntityType[entry.entityType as keyof typeof AuditEntityType],
        beforeJson: toPrismaJson(sanitizeAuditJson(entry.beforeJson)),
        afterJson: toPrismaJson(sanitizeAuditJson(entry.afterJson)),
        metadataJson: toPrismaJson(sanitizeAuditJson(entry.metadataJson)),
      },
    });
  }
}
