import type { EmailVerificationTokenRepository } from "@/modules/auth/application/register-user";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

export class PrismaEmailVerificationTokenRepository implements EmailVerificationTokenRepository {
  public constructor(
    private readonly database: Pick<PrismaClient, "emailVerificationToken"> = prisma,
  ) {}
  public async create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.database.emailVerificationToken.create({ data: input });
  }
  public async invalidateActiveForUser(userId: string, now: Date): Promise<void> {
    await this.database.emailVerificationToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: now },
    });
  }
}
