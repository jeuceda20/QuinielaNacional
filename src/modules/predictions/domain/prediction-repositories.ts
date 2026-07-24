export type PredictionEntity = Readonly<{
  id: string;
  userId: string;
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  lockedAt: Date | null;
}>;

export type PredictionScoreEntity = Readonly<{
  id: string;
  seasonId: string;
  userId: string;
  matchId: string;
  scoreType: "EXACT" | "PARTIAL" | "WRONG" | "NO_PREDICTION";
  awardedPoints: number;
  resultVersion: number;
}>;

export type StandingEntity = Readonly<{
  seasonId: string;
  userId: string;
  position: number;
  previousPosition: number | null;
  totalPoints: number;
  exactCount: number;
  partialCount: number;
}>;

export type MatchResultEntity = Readonly<{
  id: string;
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  version: number;
}>;

export interface PredictionRepository {
  findByUserAndMatch(userId: string, matchId: string): Promise<PredictionEntity | null>;
}

export interface PredictionScoreRepository {
  listBySeasonAndUser(seasonId: string, userId: string): Promise<readonly PredictionScoreEntity[]>;
}

export interface StandingRepository {
  listBySeason(seasonId: string): Promise<readonly StandingEntity[]>;
}

export interface ResultRepository {
  findCurrentByMatch(matchId: string): Promise<MatchResultEntity | null>;
}
