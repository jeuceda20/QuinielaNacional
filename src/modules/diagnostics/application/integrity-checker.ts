export type IntegrityCheckCode =
  | "ACTIVE_SEASONS"
  | "SUPER_ADMINS"
  | "DOUBLE_MATCHES"
  | "DUPLICATE_PREDICTIONS"
  | "POINTS"
  | "STANDINGS"
  | "RESULTS"
  | "CANCELLED_MATCHES";

export type IntegritySnapshot = Readonly<{
  activeSeasons: number;
  activeSuperAdmins: number;
  roundsWithoutExactlyOneDouble: number;
  duplicatePredictions: number;
  standingsWithIncorrectPoints: number;
  standingsWithoutEligibleParticipant: number;
  processedMatchesWithoutCurrentResult: number;
  cancelledMatchesWithCurrentResult: number;
}>;

export type IntegrityFinding = Readonly<{
  code: IntegrityCheckCode;
  isValid: boolean;
  affectedRecords: number;
  message: string;
}>;

export type IntegrityCheck = Readonly<{
  isValid: boolean;
  findings: readonly IntegrityFinding[];
}>;

export interface IntegrityRepository {
  getSnapshot(): Promise<IntegritySnapshot>;
}

export function checkIntegrity(snapshot: IntegritySnapshot): IntegrityCheck {
  const findings: readonly IntegrityFinding[] = [
    finding(
      "ACTIVE_SEASONS",
      snapshot.activeSeasons <= 1,
      Math.max(0, snapshot.activeSeasons - 1),
      "Debe existir como máximo una temporada activa.",
    ),
    finding(
      "SUPER_ADMINS",
      snapshot.activeSuperAdmins > 0,
      snapshot.activeSuperAdmins === 0 ? 1 : 0,
      "Debe existir al menos un superadministrador activo.",
    ),
    finding(
      "DOUBLE_MATCHES",
      snapshot.roundsWithoutExactlyOneDouble === 0,
      snapshot.roundsWithoutExactlyOneDouble,
      "Cada jornada publicada debe tener exactamente un partido doble.",
    ),
    finding(
      "DUPLICATE_PREDICTIONS",
      snapshot.duplicatePredictions === 0,
      snapshot.duplicatePredictions,
      "No puede haber predicciones duplicadas para un usuario y partido.",
    ),
    finding(
      "POINTS",
      snapshot.standingsWithIncorrectPoints === 0,
      snapshot.standingsWithIncorrectPoints,
      "Los puntos acumulados deben coincidir con las puntuaciones vigentes.",
    ),
    finding(
      "STANDINGS",
      snapshot.standingsWithoutEligibleParticipant === 0,
      snapshot.standingsWithoutEligibleParticipant,
      "Cada fila de clasificación debe pertenecer a un participante elegible.",
    ),
    finding(
      "RESULTS",
      snapshot.processedMatchesWithoutCurrentResult === 0,
      snapshot.processedMatchesWithoutCurrentResult,
      "Cada partido procesado debe tener un resultado vigente.",
    ),
    finding(
      "CANCELLED_MATCHES",
      snapshot.cancelledMatchesWithCurrentResult === 0,
      snapshot.cancelledMatchesWithCurrentResult,
      "Un partido cancelado no puede conservar un resultado vigente.",
    ),
  ];

  return { isValid: findings.every((finding) => finding.isValid), findings };
}

export class RunIntegrityCheck {
  public constructor(private readonly repository: IntegrityRepository) {}

  async execute(): Promise<IntegrityCheck> {
    return checkIntegrity(await this.repository.getSnapshot());
  }
}

function finding(
  code: IntegrityCheckCode,
  isValid: boolean,
  affectedRecords: number,
  message: string,
): IntegrityFinding {
  return { code, isValid, affectedRecords, message };
}
