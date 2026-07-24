import { createHash, randomBytes } from "node:crypto";

export type SessionAccountStatus =
  | "APPROVED"
  | "BLOCKED"
  | "DISABLED"
  | "PENDING_APPROVAL"
  | "PENDING_EMAIL_CONFIRMATION"
  | "REJECTED";

export type SessionRecord = Readonly<{
  id: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  user: { id: string; role: "USER" | "ADMIN" | "SUPER_ADMIN"; status: SessionAccountStatus };
}>;
export type SessionRepository = Readonly<{
  create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
  }): Promise<void>;
  findActiveByTokenHash(tokenHash: string, now: Date): Promise<SessionRecord | null>;
  revokeByTokenHash(tokenHash: string, revokedAt: Date): Promise<void>;
  revokeOtherSessions(userId: string, currentTokenHash: string, revokedAt: Date): Promise<void>;
  revokeExpiredSessions(now: Date): Promise<void>;
}>;

export type CreateSessionInput = Readonly<{
  userId: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}>;
export type CreatedSession = Readonly<{ token: string; expiresAt: Date }>;

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export class SessionService {
  public constructor(private readonly repository: SessionRepository) {}
  public async create(input: CreateSessionInput): Promise<CreatedSession> {
    const token = randomBytes(32).toString("base64url");
    await this.repository.create({
      userId: input.userId,
      tokenHash: hashSessionToken(token),
      expiresAt: input.expiresAt,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    });
    return { token, expiresAt: input.expiresAt };
  }
  public async validate(token: string, now: Date): Promise<SessionRecord | null> {
    const session = await this.repository.findActiveByTokenHash(hashSessionToken(token), now);
    return session?.user.status === "APPROVED" ? session : null;
  }
  public async revoke(token: string, revokedAt: Date): Promise<void> {
    await this.repository.revokeByTokenHash(hashSessionToken(token), revokedAt);
  }
  public async revokeOthers(userId: string, currentToken: string, revokedAt: Date): Promise<void> {
    await this.repository.revokeOtherSessions(userId, hashSessionToken(currentToken), revokedAt);
  }
  public async expire(now: Date): Promise<void> {
    await this.repository.revokeExpiredSessions(now);
  }
}

export function getSessionCookieOptions(isProduction: boolean) {
  return { httpOnly: true, secure: isProduction, sameSite: "lax" as const, path: "/" };
}
