export type SimulationInput = Readonly<{
  userId: string;
  currentPoints: number;
  predictedHomeGoals: number;
  predictedAwayGoals: number;
}>;
export function simulatePredictions(
  inputs: readonly SimulationInput[],
  actualHomeGoals: number,
  actualAwayGoals: number,
): readonly Readonly<{ userId: string; simulatedPoints: number }>[] {
  const outcome = Math.sign(actualHomeGoals - actualAwayGoals);
  return inputs
    .map((input) => {
      const exact =
        input.predictedHomeGoals === actualHomeGoals &&
        input.predictedAwayGoals === actualAwayGoals;
      const partial = Math.sign(input.predictedHomeGoals - input.predictedAwayGoals) === outcome;
      return {
        userId: input.userId,
        simulatedPoints: input.currentPoints + (exact ? 3 : partial ? 1 : 0),
      };
    })
    .sort((a, b) => b.simulatedPoints - a.simulatedPoints || a.userId.localeCompare(b.userId));
}
