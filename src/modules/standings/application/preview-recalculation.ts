import {
  calculateStandings,
  type StandingParticipant,
} from "@/modules/standings/domain/calculate-standings";

export type CurrentStanding = StandingParticipant & { position: number };
export type RecalculationPreviewRow = Readonly<{
  userId: string;
  nickname: string;
  currentPoints: number;
  recalculatedPoints: number;
  pointsDifference: number;
  currentPosition: number | null;
  recalculatedPosition: number;
}>;

export function previewRecalculation(
  current: readonly CurrentStanding[],
  sourceOfTruth: readonly StandingParticipant[],
): RecalculationPreviewRow[] {
  const currentByUser = new Map(current.map((standing) => [standing.userId, standing]));
  return calculateStandings(sourceOfTruth).map((standing) => {
    const existing = currentByUser.get(standing.userId);
    const currentPoints = existing?.totalPoints ?? 0;
    return {
      userId: standing.userId,
      nickname: standing.nickname,
      currentPoints,
      recalculatedPoints: standing.totalPoints,
      pointsDifference: standing.totalPoints - currentPoints,
      currentPosition: existing?.position ?? null,
      recalculatedPosition: standing.position,
    };
  });
}
