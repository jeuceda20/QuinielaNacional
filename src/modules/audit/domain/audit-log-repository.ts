export type AuditJson =
  string | number | boolean | null | readonly AuditJson[] | { readonly [key: string]: AuditJson };

export type CreateAuditLogEntry = Readonly<{
  actorUserId?: string | null;
  actorRole?: "USER" | "ADMIN" | "SUPER_ADMIN" | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  beforeJson?: AuditJson;
  afterJson?: AuditJson;
  metadataJson?: AuditJson;
  ipAddress?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
}>;

export interface AuditLogRepository {
  create(entry: CreateAuditLogEntry): Promise<void>;
}
