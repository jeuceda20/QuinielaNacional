import { z } from "zod";

import type { SessionService } from "@/modules/auth/application/session-service";
import type { PasswordHasher } from "@/modules/auth/domain/password-hasher";
import type { UserRepository } from "@/modules/users/domain/user-repository";

export const loginInputSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  ipAddress: z.string().max(64).nullable(),
  userAgent: z.string().max(500).nullable(),
});
export type LoginInput = z.infer<typeof loginInputSchema>;
export interface LoginRateLimiter {
  consume(ipAddress: string | null, emailNormalized: string, now: Date): Promise<boolean>;
}
export type LoginResult = Readonly<{
  status: "AUTHENTICATED" | "PENDING_EMAIL_CONFIRMATION" | "PENDING_APPROVAL" | "INVALID";
  token?: string;
  expiresAt?: Date;
}>;

export class LoginUser {
  public constructor(
    private readonly users: UserRepository,
    private readonly passwords: PasswordHasher,
    private readonly sessions: SessionService,
    private readonly rateLimiter: LoginRateLimiter,
    private readonly fallbackPasswordHash: string,
  ) {}
  public async execute(input: LoginInput, now: Date): Promise<LoginResult> {
    const emailNormalized = input.email.trim().toLowerCase();
    if (!(await this.rateLimiter.consume(input.ipAddress, emailNormalized, now)))
      return { status: "INVALID" };
    const user = await this.users.findByNormalizedEmail(emailNormalized);
    const passwordValid = await this.passwords.verify(
      input.password,
      user?.passwordHash ?? this.fallbackPasswordHash,
    );
    if (!user || !passwordValid) return { status: "INVALID" };
    if (user.status === "PENDING_EMAIL_CONFIRMATION")
      return { status: "PENDING_EMAIL_CONFIRMATION" };
    if (user.status !== "APPROVED")
      return { status: user.status === "PENDING_APPROVAL" ? "PENDING_APPROVAL" : "INVALID" };
    const session = await this.sessions.create({
      userId: user.id,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    return { status: "AUTHENTICATED", token: session.token, expiresAt: session.expiresAt };
  }
}
