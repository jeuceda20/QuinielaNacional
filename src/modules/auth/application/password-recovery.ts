import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";

import type { PasswordHasher } from "@/modules/auth/domain/password-hasher";
import type { EmailProvider } from "@/modules/email/domain/email-provider";
import type { UserRepository } from "@/modules/users/domain/user-repository";

export const passwordResetSchema = z
  .object({
    token: z.string().regex(/^[A-Za-z0-9_-]{32,}$/),
    password: z.string().min(12).max(128),
    passwordConfirmation: z.string(),
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Las contraseñas no coinciden.",
  });
export interface PasswordResetTokens {
  invalidateActiveForUser(userId: string, now: Date): Promise<void>;
  create(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void>;
  consumeAndReset(tokenHash: string, passwordHash: string, now: Date): Promise<string | null>;
}
export interface PasswordResetRateLimiter {
  consume(emailNormalized: string, now: Date): Promise<boolean>;
}
export const passwordRecoveryMessage = "Si la cuenta existe, enviaremos instrucciones.";

export class PasswordRecovery {
  public constructor(
    private readonly users: UserRepository,
    private readonly tokens: PasswordResetTokens,
    private readonly passwords: PasswordHasher,
    private readonly emails: EmailProvider,
    private readonly limiter: PasswordResetRateLimiter,
    private readonly appUrl: string,
    private readonly revokeAllSessions: (userId: string, now: Date) => Promise<void>,
  ) {}
  public async request(email: string, now: Date): Promise<{ message: string }> {
    const normalized = email.trim().toLowerCase();
    if (!(await this.limiter.consume(normalized, now))) return { message: passwordRecoveryMessage };
    const user = await this.users.findByNormalizedEmail(normalized);
    if (!user || user.status !== "APPROVED" || !user.emailVerifiedAt)
      return { message: passwordRecoveryMessage };
    const token = randomBytes(32).toString("base64url");
    await this.tokens.invalidateActiveForUser(user.id, now);
    await this.tokens.create({
      userId: user.id,
      tokenHash: createHash("sha256").update(token).digest("hex"),
      expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
    });
    try {
      await this.emails.sendPasswordResetEmail({
        recipient: user.email,
        recipientName: user.firstName,
        passwordResetUrl: new URL(
          `/reset-password?token=${encodeURIComponent(token)}`,
          this.appUrl,
        ).toString(),
      });
    } catch {
      /* A later request can resend a replacement. */
    }
    return { message: passwordRecoveryMessage };
  }
  public async reset(input: z.infer<typeof passwordResetSchema>, now: Date): Promise<boolean> {
    const passwordHash = await this.passwords.hash(input.password);
    const userId = await this.tokens.consumeAndReset(
      createHash("sha256").update(input.token).digest("hex"),
      passwordHash,
      now,
    );
    if (!userId) return false;
    await this.revokeAllSessions(userId, now);
    return true;
  }
}
