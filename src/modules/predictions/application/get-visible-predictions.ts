export type VisiblePrediction = Readonly<{
  userId: string;
  nickname?: string;
  homeGoals: number;
  awayGoals: number;
}>;
export interface PredictionVisibilityRepository {
  getOwn(matchId: string, userId: string): Promise<VisiblePrediction[]>;
  getAfterClose(matchId: string): Promise<VisiblePrediction[]>;
  getClosesAt(matchId: string): Promise<Date | null>;
}
export class GetVisiblePredictions {
  public constructor(private readonly predictions: PredictionVisibilityRepository) {}
  async execute(userId: string, matchId: string, now: Date) {
    const closesAt = await this.predictions.getClosesAt(matchId);
    if (!closesAt) throw new Error("MATCH_NOT_FOUND");
    return now < closesAt
      ? this.predictions.getOwn(matchId, userId)
      : this.predictions.getAfterClose(matchId);
  }
}
