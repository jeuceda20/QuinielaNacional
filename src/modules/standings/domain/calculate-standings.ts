export type StandingParticipant = {
  userId: string;
  nickname: string;
  totalPoints: number;
  exactCount: number;
  doubleExactCount?: number;
  partialCount: number;
};

export type CalculatedStanding = StandingParticipant & {
  position: number;
};

export class InvalidStandingInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidStandingInputError";
  }
}

function validateParticipant(participant: StandingParticipant): void {
  if (participant.userId.trim().length === 0) {
    throw new InvalidStandingInputError("userId must not be empty.");
  }

  if (participant.nickname.trim().length === 0) {
    throw new InvalidStandingInputError("nickname must not be empty.");
  }

  const counters = [
    participant.totalPoints,
    participant.exactCount,
    participant.doubleExactCount ?? 0,
    participant.partialCount,
  ];

  if (counters.some((value) => !Number.isInteger(value) || value < 0)) {
    throw new InvalidStandingInputError("Points and score counters must be non-negative integers.");
  }
}

function compareParticipants(left: StandingParticipant, right: StandingParticipant): number {
  if (left.totalPoints !== right.totalPoints) {
    return right.totalPoints - left.totalPoints;
  }

  if (left.exactCount !== right.exactCount) {
    return right.exactCount - left.exactCount;
  }

  if ((left.doubleExactCount ?? 0) !== (right.doubleExactCount ?? 0)) {
    return (right.doubleExactCount ?? 0) - (left.doubleExactCount ?? 0);
  }

  const normalizedLeftNickname = left.nickname.toLowerCase();
  const normalizedRightNickname = right.nickname.toLowerCase();

  if (normalizedLeftNickname < normalizedRightNickname) {
    return -1;
  }

  if (normalizedLeftNickname > normalizedRightNickname) {
    return 1;
  }

  return left.userId.localeCompare(right.userId);
}

function sharesSportingPosition(left: StandingParticipant, right: StandingParticipant): boolean {
  return (
    left.totalPoints === right.totalPoints &&
    left.exactCount === right.exactCount &&
    (left.doubleExactCount ?? 0) === (right.doubleExactCount ?? 0)
  );
}

export function calculateStandings(
  participants: readonly StandingParticipant[],
): CalculatedStanding[] {
  const userIds = new Set<string>();

  for (const participant of participants) {
    validateParticipant(participant);

    if (userIds.has(participant.userId)) {
      throw new InvalidStandingInputError("userId must be unique in a standing calculation.");
    }

    userIds.add(participant.userId);
  }

  const sortedParticipants = [...participants].sort(compareParticipants);
  let currentPosition = 0;

  return sortedParticipants.map((participant, index) => {
    const previousParticipant = sortedParticipants[index - 1];

    if (
      previousParticipant === undefined ||
      !sharesSportingPosition(participant, previousParticipant)
    ) {
      currentPosition = index + 1;
    }

    return {
      ...participant,
      position: currentPosition,
    };
  });
}
