import type { ProcessMatchResultInput } from "@/modules/results/application/process-match-result";

export type OfficialResult = Pick<ProcessMatchResultInput, "homeGoals" | "awayGoals">;

export function isSameOfficialResult(current: OfficialResult, requested: OfficialResult): boolean {
  return current.homeGoals === requested.homeGoals && current.awayGoals === requested.awayGoals;
}
