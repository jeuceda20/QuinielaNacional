export type TeamEntity = Readonly<{
  id: string;
  name: string;
  shortName: string;
  slug: string;
  logoPath: string | null;
  displayOrder: number;
  isActive: boolean;
}>;

export type SeasonEntity = Readonly<{
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "ACTIVE" | "CLOSED" | "ARCHIVED";
  predictionCloseMinutes: number;
}>;

export type RoundEntity = Readonly<{
  id: string;
  seasonId: string;
  name: string;
  slug: string;
  sequence: number | null;
  status: "DRAFT" | "PUBLISHED" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
}>;

export type MatchEntity = Readonly<{
  id: string;
  seasonId: string;
  roundId: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: Date;
  predictionClosesAt: Date;
  status:
    | "SCHEDULED"
    | "RESCHEDULED"
    | "CLOSED"
    | "SUSPENDED"
    | "RESUMED"
    | "FINISHED_PENDING"
    | "PROCESSED"
    | "CANCELLED";
  isDoublePoints: boolean;
}>;

export interface TeamRepository {
  findById(id: string): Promise<TeamEntity | null>;
  listActive(): Promise<readonly TeamEntity[]>;
}

export interface SeasonRepository {
  findById(id: string): Promise<SeasonEntity | null>;
  findActive(): Promise<SeasonEntity | null>;
}

export interface RoundRepository {
  findById(id: string): Promise<RoundEntity | null>;
  listBySeason(seasonId: string): Promise<readonly RoundEntity[]>;
}

export interface MatchRepository {
  findById(id: string): Promise<MatchEntity | null>;
  listByRound(roundId: string): Promise<readonly MatchEntity[]>;
}
