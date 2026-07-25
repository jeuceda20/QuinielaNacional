import { z } from "zod";

import type { RequestContext } from "@/lib/request-context";

export const processMatchResultSchema = z.object({
  matchId: z.string().uuid(),
  homeGoals: z.number().int().min(0),
  awayGoals: z.number().int().min(0),
});

export type ProcessMatchResultInput = z.infer<typeof processMatchResultSchema>;
export type ProcessMatchResultOutcome =
  | "PROCESSED"
  | "MATCH_NOT_FOUND"
  | "MATCH_CANCELLED"
  | "MATCH_ALREADY_PROCESSED"
  | "MATCH_NOT_READY";

export interface ProcessMatchResultRepository {
  process(
    input: ProcessMatchResultInput & {
      actorId: string;
      actorRole: "ADMIN" | "SUPER_ADMIN";
      now: Date;
      requestId: string;
      ipAddress: string | null;
      userAgent: string | null;
    },
  ): Promise<ProcessMatchResultOutcome>;
}

export class ProcessMatchResultService {
  public constructor(private readonly repository: ProcessMatchResultRepository) {}

  public async execute(
    context: RequestContext,
    input: ProcessMatchResultInput,
    now: Date,
  ): Promise<void> {
    if (!context.userId) throw new Error("UNAUTHENTICATED");
    if (context.role !== "ADMIN" && context.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");
    const outcome = await this.repository.process({
      ...input,
      actorId: context.userId,
      actorRole: context.role,
      now,
      requestId: context.requestId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
    if (outcome !== "PROCESSED") throw new Error(outcome);
  }
}
