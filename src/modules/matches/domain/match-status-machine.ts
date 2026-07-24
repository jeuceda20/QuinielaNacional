export enum MatchStatus {
  SCHEDULED = "SCHEDULED",
  RESCHEDULED = "RESCHEDULED",
  CLOSED = "CLOSED",
  SUSPENDED = "SUSPENDED",
  RESUMED = "RESUMED",
  FINISHED_PENDING = "FINISHED_PENDING",
  PROCESSED = "PROCESSED",
  CANCELLED = "CANCELLED",
}

export class InvalidMatchStatusTransitionError extends Error {
  public constructor(
    public readonly from: MatchStatus,
    public readonly to: MatchStatus,
  ) {
    super(`Cannot transition a match from ${from} to ${to}.`);
    this.name = "InvalidMatchStatusTransitionError";
  }
}

const transitions: Readonly<Record<MatchStatus, readonly MatchStatus[]>> = {
  [MatchStatus.SCHEDULED]: [
    MatchStatus.RESCHEDULED,
    MatchStatus.CLOSED,
    MatchStatus.SUSPENDED,
    MatchStatus.CANCELLED,
  ],
  [MatchStatus.RESCHEDULED]: [MatchStatus.CLOSED, MatchStatus.SUSPENDED, MatchStatus.CANCELLED],
  [MatchStatus.CLOSED]: [
    MatchStatus.RESCHEDULED,
    MatchStatus.SUSPENDED,
    MatchStatus.FINISHED_PENDING,
    MatchStatus.CANCELLED,
  ],
  [MatchStatus.SUSPENDED]: [
    MatchStatus.RESCHEDULED,
    MatchStatus.RESUMED,
    MatchStatus.FINISHED_PENDING,
    MatchStatus.CANCELLED,
  ],
  [MatchStatus.RESUMED]: [
    MatchStatus.RESCHEDULED,
    MatchStatus.SUSPENDED,
    MatchStatus.FINISHED_PENDING,
    MatchStatus.CANCELLED,
  ],
  [MatchStatus.FINISHED_PENDING]: [MatchStatus.PROCESSED],
  [MatchStatus.PROCESSED]: [],
  [MatchStatus.CANCELLED]: [],
};

export function getAllowedMatchStatusTransitions(status: MatchStatus): readonly MatchStatus[] {
  return transitions[status];
}

export function isMatchStatusTransitionAllowed(from: MatchStatus, to: MatchStatus): boolean {
  return transitions[from].includes(to);
}

export function transitionMatchStatus(from: MatchStatus, to: MatchStatus): MatchStatus {
  if (!isMatchStatusTransitionAllowed(from, to)) {
    throw new InvalidMatchStatusTransitionError(from, to);
  }

  return to;
}

export function isTerminalMatchStatus(status: MatchStatus): boolean {
  return transitions[status].length === 0;
}
