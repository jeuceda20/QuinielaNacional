import type { SessionRecord, SessionRepository } from "@/modules/auth/application/session-service";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

export type SessionDatabase = Pick<PrismaClient, "session">;

export class PrismaSessionRepository implements SessionRepository {
  public constructor(private readonly database: SessionDatabase = prisma) {}

  public async create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
  }): Promise<void> {
    await this.database.session.create({ data: input });
  }

  public async findActiveByTokenHash(tokenHash: string, now: Date): Promise<SessionRecord | null> {
    const session = await this.database.session.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: now } },
      include: { user: { select: { id: true, role: true, status: true } } },
    });
    return session;
  }

  public async revokeByTokenHash(tokenHash: string, revokedAt: Date): Promise<void> {
    await this.database.session.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt },
    });
  }

  public async revokeOtherSessions(
    userId: string,
    currentTokenHash: string,
    revokedAt: Date,
  ): Promise<void> {
    await this.database.session.updateMany({
      where: { userId, tokenHash: { not: currentTokenHash }, revokedAt: null },
      data: { revokedAt },
    });
  }

  public async revokeExpiredSessions(now: Date): Promise<void> {
    await this.database.session.updateMany({
      where: { expiresAt: { lte: now }, revokedAt: null },
      data: { revokedAt: now },
    });
  }
}
