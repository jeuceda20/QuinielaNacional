export type RestorationSnapshot = Readonly<{
  databaseUrl: string;
  sourceCounts: Readonly<Record<string, number>>;
  restoredCounts: Readonly<Record<string, number>>;
  sourceStandings: readonly Readonly<{
    seasonId: string;
    userId: string;
    totalPoints: number;
    position: number;
  }>[];
  restoredStandings: readonly Readonly<{
    seasonId: string;
    userId: string;
    totalPoints: number;
    position: number;
  }>[];
  integrityValid: boolean;
}>;

export function verifyRestoration(snapshot: RestorationSnapshot): void {
  if (!new URL(snapshot.databaseUrl).pathname.slice(1).endsWith("_test"))
    throw new Error("La restauracion solo se permite en una base de datos _test.");
  if (!snapshot.integrityValid)
    throw new Error("La verificacion de integridad fallo tras la restauracion.");
  if (JSON.stringify(snapshot.sourceCounts) !== JSON.stringify(snapshot.restoredCounts))
    throw new Error("Los conteos restaurados no coinciden con el origen.");
  const serialize = (rows: RestorationSnapshot["sourceStandings"]) =>
    [...rows].sort((a, b) =>
      `${a.seasonId}:${a.userId}`.localeCompare(`${b.seasonId}:${b.userId}`),
    );
  if (
    JSON.stringify(serialize(snapshot.sourceStandings)) !==
    JSON.stringify(serialize(snapshot.restoredStandings))
  )
    throw new Error("Los standings restaurados no coinciden con el origen.");
}
