import { z } from "zod";

import type { PasswordHasher } from "@/modules/auth/domain/password-hasher";

import type { RequestContext } from "@/lib/request-context";

export const correctMatchResultSchema = z.object({
  matchId: z.string().uuid(),
  homeGoals: z.number().int().min(0),
  awayGoals: z.number().int().min(0),
  reason: z.string().trim().min(3).max(500),
  password: z.string().min(1),
});
export type CorrectMatchResultInput = z.infer<typeof correctMatchResultSchema>;
export interface MatchResultCorrectionRepository {
  getPasswordHash(userId: string): Promise<string | null>;
  correct(
    input: Omit<CorrectMatchResultInput, "password"> & {
      actorId: string;
      requestId: string;
      now: Date;
    },
  ): Promise<"CORRECTED" | "MATCH_NOT_FOUND" | "MATCH_NOT_PROCESSED">;
}
export class CorrectMatchResultService {
  public constructor(
    private readonly repository: MatchResultCorrectionRepository,
    private readonly passwords: PasswordHasher,
  ) {}
  async execute(context: RequestContext, input: CorrectMatchResultInput, now: Date) {
    if (!context.userId) throw new Error("UNAUTHENTICATED");
    if (context.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");
    const hash = await this.repository.getPasswordHash(context.userId);
    if (!hash || !(await this.passwords.verify(input.password, hash)))
      throw new Error("REAUTHENTICATION_REQUIRED");
    const correction = {
      matchId: input.matchId,
      homeGoals: input.homeGoals,
      awayGoals: input.awayGoals,
      reason: input.reason,
    };
    const outcome = await this.repository.correct({
      ...correction,
      actorId: context.userId,
      requestId: context.requestId,
      now,
    });
    if (outcome !== "CORRECTED") throw new Error(outcome);
  }
}
