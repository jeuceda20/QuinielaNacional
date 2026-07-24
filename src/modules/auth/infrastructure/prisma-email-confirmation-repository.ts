import type {
  EmailConfirmationOutcome,
  EmailConfirmationRepository,
} from "@/modules/auth/application/confirm-email";

import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@/generated/prisma/client";

export class PrismaEmailConfirmationRepository implements EmailConfirmationRepository {
  public constructor(private readonly database: PrismaClient = prisma) {}

  public async confirm(tokenHash: string, now: Date): Promise<EmailConfirmationOutcome> {
    return this.database.$transaction(async (transaction) => {
      const token = await transaction.emailVerificationToken.findUnique({
        where: { tokenHash },
        include: { user: { select: { id: true, status: true, emailVerifiedAt: true } } },
      });
      if (!token || token.expiresAt <= now) return "INVALID";
      if (token.usedAt)
        return token.user.status === "PENDING_APPROVAL" ? "ALREADY_CONFIRMED" : "INVALID";
      if (token.user.status !== "PENDING_EMAIL_CONFIRMATION") return "INVALID";
      await transaction.user.update({
        where: { id: token.user.id },
        data: { status: "PENDING_APPROVAL", emailVerifiedAt: now },
      });
      await transaction.emailVerificationToken.update({
        where: { id: token.id },
        data: { usedAt: now },
      });
      return "CONFIRMED";
    });
  }
}
