const defaultPredictionCloseMinutes = 5;

export type PredictionWindowInput = {
  serverNow: Date;
  predictionClosesAt: Date;
};

export class InvalidPredictionCloseTimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPredictionCloseTimeError";
  }
}

function validateDate(field: string, value: Date): void {
  if (Number.isNaN(value.getTime())) {
    throw new InvalidPredictionCloseTimeError(`${field} must be a valid date.`);
  }
}

export function calculatePredictionClosesAt(
  scheduledAt: Date,
  predictionCloseMinutes: number = defaultPredictionCloseMinutes,
): Date {
  validateDate("scheduledAt", scheduledAt);

  if (!Number.isInteger(predictionCloseMinutes) || predictionCloseMinutes < 0) {
    throw new InvalidPredictionCloseTimeError(
      "predictionCloseMinutes must be a non-negative integer.",
    );
  }

  return new Date(scheduledAt.getTime() - predictionCloseMinutes * 60_000);
}

export function canSubmitPrediction({
  serverNow,
  predictionClosesAt,
}: PredictionWindowInput): boolean {
  validateDate("serverNow", serverNow);
  validateDate("predictionClosesAt", predictionClosesAt);

  return serverNow < predictionClosesAt;
}

export function canViewOtherPredictions(input: PredictionWindowInput): boolean {
  return !canSubmitPrediction(input);
}
