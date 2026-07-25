export type PublicStanding = Readonly<{
  position: number;
  nickname: string;
  partialCount: number;
  exactCount: number;
  totalPoints: number;
  previousPosition: number | null;
}>;

export interface PublicStandingsRepository {
  list(): Promise<readonly PublicStanding[]>;
}

export class GetPublicStandings {
  public constructor(private readonly repository: PublicStandingsRepository) {}

  public execute(): Promise<readonly PublicStanding[]> {
    return this.repository.list();
  }
}
