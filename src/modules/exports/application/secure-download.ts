import { createHmac, timingSafeEqual } from "node:crypto";

export type DownloadTokenPayload = Readonly<{
  exportRunId: string;
  userId: string;
  expiresAt: number;
}>;
export interface DownloadAuditRepository {
  recordDownload(input: {
    exportRunId: string;
    userId: string;
    requestId: string | null;
  }): Promise<void>;
}

export function createDownloadToken(payload: DownloadTokenPayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}
export function verifyDownloadToken(
  token: string,
  userId: string,
  secret: string,
  now: Date,
): DownloadTokenPayload | null {
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra || !safeEqual(signature, sign(body, secret))) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as DownloadTokenPayload;
    return payload.userId === userId &&
      Number.isFinite(payload.expiresAt) &&
      payload.expiresAt > now.getTime()
      ? payload
      : null;
  } catch {
    return null;
  }
}
export class SecureDownloadAuthorizer {
  public constructor(
    private readonly audit: DownloadAuditRepository,
    private readonly secret: string,
    private readonly now: () => Date = () => new Date(),
  ) {}
  async authorize(token: string, userId: string, requestId: string | null): Promise<string | null> {
    const payload = verifyDownloadToken(token, userId, this.secret, this.now());
    if (!payload) return null;
    await this.audit.recordDownload({ exportRunId: payload.exportRunId, userId, requestId });
    return payload.exportRunId;
  }
}
function sign(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}
function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left),
    b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
