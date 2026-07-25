export type PublicResultRow = Readonly<{
  nickname: string;
  prediction: string | null;
  scoreType: "EXACT" | "PARTIAL" | "WRONG" | "NO_PREDICTION";
  awardedPoints: number;
}>;

export type PublicMatchResult = Readonly<{
  id: string;
  roundName: string;
  homeTeam: string;
  awayTeam: string;
  officialResult: string;
  rows: readonly PublicResultRow[];
}>;

export interface PublicResultsRepository {
  list(): Promise<readonly PublicMatchResult[]>;
}

export class GetPublicResults {
  public constructor(private readonly repository: PublicResultsRepository) {}

  public execute(): Promise<readonly PublicMatchResult[]> {
    return this.repository.list();
  }
}
