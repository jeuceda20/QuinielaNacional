export type PendingPredictionMatch = Readonly<{
  id: string;
  scheduledAt: Date;
  predictionClosesAt: Date;
  isDoublePoints: boolean;
  roundName: string;
  homeTeam: Readonly<{ name: string; logoPath: string | null }>;
  awayTeam: Readonly<{ name: string; logoPath: string | null }>;
}>;
export interface PendingPredictionRepository {
  list(userId: string, now: Date): Promise<readonly PendingPredictionMatch[]>;
}
export class GetPendingPredictions {
  public constructor(private readonly predictions: PendingPredictionRepository) {}
  execute(userId: string, now: Date) {
    return this.predictions.list(userId, now);
  }
}
