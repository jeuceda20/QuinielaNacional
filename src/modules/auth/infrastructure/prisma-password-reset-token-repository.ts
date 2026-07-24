import type { PasswordResetTokens } from "@/modules/auth/application/password-recovery";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

type PasswordResetTokenDatabase = Pick<
  PrismaClient,
  "passwordResetToken" | "user" | "$transaction"
>;

export class PrismaPasswordResetTokenRepository implements PasswordResetTokens {
  public constructor(private readonly database: PasswordResetTokenDatabase = prisma) {}

  public async invalidateActiveForUser(userId: string, now: Date): Promise<void> {
    await this.database.passwordResetToken.updateMany({
      where: { userId, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });
  }

  public async create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.database.passwordResetToken.create({ data: input });
  }

  public async consumeAndReset(
    tokenHash: string,
    passwordHash: string,
    now: Date,
  ): Promise<string | null> {
    return this.database.$transaction(async (transaction) => {
      const token = await transaction.passwordResetToken.findFirst({
        where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
        select: { id: true, userId: true },
      });
      if (!token) return null;

      const consumed = await transaction.passwordResetToken.updateMany({
        where: { id: token.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) return null;

      await transaction.user.update({ where: { id: token.userId }, data: { passwordHash } });
      return token.userId;
    });
  }
}
