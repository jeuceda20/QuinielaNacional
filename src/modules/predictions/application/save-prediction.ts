import { z } from "zod";

import type { RequestContext } from "@/lib/request-context";
export const savePredictionSchema = z.object({
  matchId: z.string().uuid(),
  homeGoals: z.number().int().min(0).max(20),
  awayGoals: z.number().int().min(0).max(20),
});
export interface SavePredictionRepository {
  save(input: {
    userId: string;
    matchId: string;
    homeGoals: number;
    awayGoals: number;
    now: Date;
  }): Promise<"SAVED" | "NOT_PARTICIPANT" | "MATCH_NOT_FOUND" | "MATCH_CLOSED">;
}
export class SavePredictionService {
  public constructor(private readonly predictions: SavePredictionRepository) {}
  async execute(context: RequestContext, input: z.infer<typeof savePredictionSchema>, now: Date) {
    if (!context.userId) throw new Error("UNAUTHENTICATED");
    const r = await this.predictions.save({ ...input, userId: context.userId, now });
    if (r !== "SAVED") throw new Error(r);
  }
}
