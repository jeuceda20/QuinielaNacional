export enum StandingTrend {
  UP = "UP",
  DOWN = "DOWN",
  SAME = "SAME",
  NEW = "NEW",
}

export type StandingTrendInput = {
  currentPosition: number;
  previousPosition?: number | null;
};

export class InvalidStandingPositionError extends Error {
  constructor(field: "currentPosition" | "previousPosition", value: number) {
    super(`${field} must be a positive integer. Received: ${value}.`);
    this.name = "InvalidStandingPositionError";
  }
}

function validatePosition(field: "currentPosition" | "previousPosition", value: number): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new InvalidStandingPositionError(field, value);
  }
}

export function getStandingTrend({
  currentPosition,
  previousPosition = null,
}: StandingTrendInput): StandingTrend {
  validatePosition("currentPosition", currentPosition);

  if (previousPosition === null) {
    return StandingTrend.NEW;
  }

  validatePosition("previousPosition", previousPosition);

  if (currentPosition < previousPosition) {
    return StandingTrend.UP;
  }

  if (currentPosition > previousPosition) {
    return StandingTrend.DOWN;
  }

  return StandingTrend.SAME;
}
