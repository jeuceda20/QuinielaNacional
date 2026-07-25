import { createHash } from "node:crypto";

export type RateLimitRule = Readonly<{
  limit: number;
  windowMs: number;
}>;

export interface RateLimitRepository {
  consume(key: string, rule: RateLimitRule, now: Date): Promise<boolean>;
}

export class RateLimiter {
  public constructor(private readonly repository: RateLimitRepository) {}

  public consume(scope: string, subject: string | null, rule: RateLimitRule, now: Date) {
    const normalizedSubject = subject?.trim().toLowerCase() || "anonymous";
    const key = createHash("sha256").update(`${scope}:${normalizedSubject}`).digest("hex");

    return this.repository.consume(key, rule, now);
  }
}

export const rateLimitRules = {
  loginByIp: { limit: 10, windowMs: 15 * 60 * 1000 },
  loginByEmail: { limit: 5, windowMs: 15 * 60 * 1000 },
  registrationByIp: { limit: 5, windowMs: 60 * 60 * 1000 },
  passwordRecoveryByEmail: { limit: 3, windowMs: 60 * 60 * 1000 },
  smtpByRecipient: { limit: 10, windowMs: 60 * 60 * 1000 },
  sqlByUser: { limit: 20, windowMs: 60 * 1000 },
} as const satisfies Record<string, RateLimitRule>;
