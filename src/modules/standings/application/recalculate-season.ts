import type { RequestContext } from "@/lib/request-context";

export type RecalculationSummary = Readonly<{ matches: number; scores: number; standings: number }>;
export interface SeasonRecalculationRepository {
  recalculate(input: {
    seasonId: string;
    actorId: string;
    requestId: string;
    now: Date;
  }): Promise<RecalculationSummary | null>;
}
export class RecalculateSeasonService {
  public constructor(private readonly repository: SeasonRecalculationRepository) {}
  async execute(
    context: RequestContext,
    seasonId: string,
    now: Date,
  ): Promise<RecalculationSummary> {
    if (!context.userId) throw new Error("UNAUTHENTICATED");
    if (context.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");
    const summary = await this.repository.recalculate({
      seasonId,
      actorId: context.userId,
      requestId: context.requestId,
      now,
    });
    if (!summary) throw new Error("SEASON_NOT_FOUND");
    return summary;
  }
}
