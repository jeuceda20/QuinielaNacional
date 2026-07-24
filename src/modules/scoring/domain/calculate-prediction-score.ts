import { getMatchOutcome, type Score } from "@/modules/scoring/domain/get-match-outcome";

export enum PredictionScoreType {
  EXACT = "EXACT",
  PARTIAL = "PARTIAL",
  WRONG = "WRONG",
  NO_PREDICTION = "NO_PREDICTION",
}

export type ScoringRules = {
  exactPoints: number;
  partialPoints: number;
  wrongPoints: number;
  doubleMultiplier: number;
};

export type CalculatePredictionScoreInput = {
  prediction: Score | null;
  officialResult: Score;
  isDoublePoints?: boolean;
  rules?: ScoringRules;
};

export type CalculatedPredictionScore = {
  scoreType: PredictionScoreType;
  basePoints: number;
  multiplier: number;
  awardedPoints: number;
};

export const defaultScoringRules: ScoringRules = {
  exactPoints: 3,
  partialPoints: 1,
  wrongPoints: 0,
  doubleMultiplier: 2,
};

export class InvalidScoringRulesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidScoringRulesError";
  }
}

function validateScoringRules(rules: ScoringRules): void {
  const pointValues = [rules.exactPoints, rules.partialPoints, rules.wrongPoints];

  if (pointValues.some((value) => !Number.isInteger(value) || value < 0)) {
    throw new InvalidScoringRulesError("Point values must be non-negative integers.");
  }

  if (rules.doubleMultiplier !== 1 && rules.doubleMultiplier !== 2) {
    throw new InvalidScoringRulesError("doubleMultiplier must be 1 or 2.");
  }
}

function calculateBaseScore(
  prediction: Score | null,
  officialResult: Score,
  rules: ScoringRules,
): Pick<CalculatedPredictionScore, "scoreType" | "basePoints"> {
  if (prediction === null) {
    return {
      scoreType: PredictionScoreType.NO_PREDICTION,
      basePoints: 0,
    };
  }

  if (
    prediction.homeGoals === officialResult.homeGoals &&
    prediction.awayGoals === officialResult.awayGoals
  ) {
    return {
      scoreType: PredictionScoreType.EXACT,
      basePoints: rules.exactPoints,
    };
  }

  if (getMatchOutcome(prediction) === getMatchOutcome(officialResult)) {
    return {
      scoreType: PredictionScoreType.PARTIAL,
      basePoints: rules.partialPoints,
    };
  }

  return {
    scoreType: PredictionScoreType.WRONG,
    basePoints: rules.wrongPoints,
  };
}

export function calculatePredictionScore({
  prediction,
  officialResult,
  isDoublePoints = false,
  rules = defaultScoringRules,
}: CalculatePredictionScoreInput): CalculatedPredictionScore {
  validateScoringRules(rules);
  getMatchOutcome(officialResult);

  const { scoreType, basePoints } = calculateBaseScore(prediction, officialResult, rules);
  const multiplier = isDoublePoints ? rules.doubleMultiplier : 1;

  return {
    scoreType,
    basePoints,
    multiplier,
    awardedPoints: basePoints * multiplier,
  };
}
