export enum MatchOutcome {
  HOME_WIN = "HOME_WIN",
  DRAW = "DRAW",
  AWAY_WIN = "AWAY_WIN",
}

export type Score = {
  homeGoals: number;
  awayGoals: number;
};

export class InvalidScoreError extends Error {
  constructor(field: keyof Score, value: number) {
    super(`${field} must be a non-negative integer. Received: ${value}.`);
    this.name = "InvalidScoreError";
  }
}

function validateGoals(field: keyof Score, value: number): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new InvalidScoreError(field, value);
  }
}

export function getMatchOutcome({ homeGoals, awayGoals }: Score): MatchOutcome {
  validateGoals("homeGoals", homeGoals);
  validateGoals("awayGoals", awayGoals);

  if (homeGoals > awayGoals) {
    return MatchOutcome.HOME_WIN;
  }

  if (homeGoals < awayGoals) {
    return MatchOutcome.AWAY_WIN;
  }

  return MatchOutcome.DRAW;
}
