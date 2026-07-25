import type {
  RateLimitRepository,
  RateLimitRule,
} from "@/modules/security/application/rate-limiter";

import { prisma } from "@/lib/prisma";

import { Prisma, type PrismaClient } from "@/generated/prisma/client";

type RateLimitDatabase = Pick<PrismaClient, "$queryRaw">;

type RateLimitResult = Readonly<{ count: number }>;

export class PrismaRateLimitRepository implements RateLimitRepository {
  public constructor(private readonly database: RateLimitDatabase = prisma) {}

  public async consume(key: string, rule: RateLimitRule, now: Date): Promise<boolean> {
    const windowStart = new Date(now.getTime() - rule.windowMs);
    const result = await this.database.$queryRaw<RateLimitResult[]>(Prisma.sql`
      INSERT INTO "RateLimitBucket" ("key", "windowStartedAt", "count", "updatedAt")
      VALUES (${key}, ${now}, 1, ${now})
      ON CONFLICT ("key") DO UPDATE
      SET
        "count" = CASE
          WHEN "RateLimitBucket"."windowStartedAt" <= ${windowStart} THEN 1
          ELSE "RateLimitBucket"."count" + 1
        END,
        "windowStartedAt" = CASE
          WHEN "RateLimitBucket"."windowStartedAt" <= ${windowStart} THEN ${now}
          ELSE "RateLimitBucket"."windowStartedAt"
        END,
        "updatedAt" = ${now}
      WHERE
        "RateLimitBucket"."windowStartedAt" <= ${windowStart}
        OR "RateLimitBucket"."count" < ${rule.limit}
      RETURNING "count"
    `);

    return result.length === 1;
  }
}
