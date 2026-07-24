import { describe, expect, it } from "vitest";

import {
  calculateStandings,
  InvalidStandingInputError,
  type StandingParticipant,
} from "@/modules/standings/domain/calculate-standings";

const participants: StandingParticipant[] = [
  { userId: "user-1", nickname: "Zoe", totalPoints: 10, exactCount: 2, partialCount: 4 },
  { userId: "user-2", nickname: "Ana", totalPoints: 12, exactCount: 1, partialCount: 1 },
  { userId: "user-3", nickname: "Beto", totalPoints: 12, exactCount: 3, partialCount: 0 },
];

describe("calculateStandings", () => {
  it("orders by total points and then exact predictions", () => {
    const standings = calculateStandings(participants);

    expect(standings.map(({ userId, position }) => ({ userId, position }))).toEqual([
      { userId: "user-3", position: 1 },
      { userId: "user-2", position: 2 },
      { userId: "user-1", position: 3 },
    ]);
  });

  it("assigns competition positions for complete ties", () => {
    const standings = calculateStandings([
      { userId: "user-1", nickname: "Carlos", totalPoints: 20, exactCount: 5, partialCount: 2 },
      { userId: "user-2", nickname: "Ana", totalPoints: 18, exactCount: 4, partialCount: 9 },
      { userId: "user-3", nickname: "Beto", totalPoints: 18, exactCount: 4, partialCount: 1 },
      { userId: "user-4", nickname: "Diana", totalPoints: 16, exactCount: 3, partialCount: 6 },
    ]);

    expect(standings.map(({ nickname, position }) => ({ nickname, position }))).toEqual([
      { nickname: "Carlos", position: 1 },
      { nickname: "Ana", position: 2 },
      { nickname: "Beto", position: 2 },
      { nickname: "Diana", position: 4 },
    ]);
  });

  it("uses nickname only as a stable visual order and not as a sporting tiebreaker", () => {
    const standings = calculateStandings([
      { userId: "user-1", nickname: "zeta", totalPoints: 10, exactCount: 2, partialCount: 0 },
      { userId: "user-2", nickname: "Alfa", totalPoints: 10, exactCount: 2, partialCount: 7 },
    ]);

    expect(standings.map(({ nickname, position }) => ({ nickname, position }))).toEqual([
      { nickname: "Alfa", position: 1 },
      { nickname: "zeta", position: 1 },
    ]);
  });

  it("rejects duplicate users and invalid counters", () => {
    expect(() =>
      calculateStandings([
        { userId: "user-1", nickname: "Ana", totalPoints: 1, exactCount: 0, partialCount: 0 },
        { userId: "user-1", nickname: "Beto", totalPoints: 0, exactCount: 0, partialCount: 0 },
      ]),
    ).toThrow(InvalidStandingInputError);

    expect(() =>
      calculateStandings([
        { userId: "user-1", nickname: "Ana", totalPoints: -1, exactCount: 0, partialCount: 0 },
      ]),
    ).toThrow(InvalidStandingInputError);
  });
});
