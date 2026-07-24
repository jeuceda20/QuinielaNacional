import { describe, expect, it } from "vitest";

import {
  getAllowedMatchStatusTransitions,
  InvalidMatchStatusTransitionError,
  isMatchStatusTransitionAllowed,
  isTerminalMatchStatus,
  MatchStatus,
  transitionMatchStatus,
} from "@/modules/matches/domain/match-status-machine";

describe("match status machine", () => {
  it.each([
    [MatchStatus.SCHEDULED, MatchStatus.RESCHEDULED],
    [MatchStatus.SCHEDULED, MatchStatus.CLOSED],
    [MatchStatus.SCHEDULED, MatchStatus.SUSPENDED],
    [MatchStatus.SCHEDULED, MatchStatus.CANCELLED],
    [MatchStatus.RESCHEDULED, MatchStatus.CLOSED],
    [MatchStatus.CLOSED, MatchStatus.RESCHEDULED],
    [MatchStatus.CLOSED, MatchStatus.FINISHED_PENDING],
    [MatchStatus.SUSPENDED, MatchStatus.RESUMED],
    [MatchStatus.SUSPENDED, MatchStatus.FINISHED_PENDING],
    [MatchStatus.RESUMED, MatchStatus.SUSPENDED],
    [MatchStatus.RESUMED, MatchStatus.FINISHED_PENDING],
    [MatchStatus.FINISHED_PENDING, MatchStatus.PROCESSED],
  ])("allows %s -> %s", (from, to) => {
    expect(isMatchStatusTransitionAllowed(from, to)).toBe(true);
    expect(transitionMatchStatus(from, to)).toBe(to);
  });

  it("does not expose arbitrary direct transitions", () => {
    expect(getAllowedMatchStatusTransitions(MatchStatus.SCHEDULED)).toEqual([
      MatchStatus.RESCHEDULED,
      MatchStatus.CLOSED,
      MatchStatus.SUSPENDED,
      MatchStatus.CANCELLED,
    ]);
    expect(isMatchStatusTransitionAllowed(MatchStatus.CLOSED, MatchStatus.PROCESSED)).toBe(false);
  });

  it.each([
    [MatchStatus.SCHEDULED, MatchStatus.PROCESSED],
    [MatchStatus.RESCHEDULED, MatchStatus.FINISHED_PENDING],
    [MatchStatus.FINISHED_PENDING, MatchStatus.CANCELLED],
    [MatchStatus.PROCESSED, MatchStatus.CLOSED],
    [MatchStatus.CANCELLED, MatchStatus.SCHEDULED],
  ])("rejects %s -> %s", (from, to) => {
    expect(() => transitionMatchStatus(from, to)).toThrow(InvalidMatchStatusTransitionError);
  });

  it("marks only processed and cancelled statuses as terminal", () => {
    expect(isTerminalMatchStatus(MatchStatus.PROCESSED)).toBe(true);
    expect(isTerminalMatchStatus(MatchStatus.CANCELLED)).toBe(true);
    expect(isTerminalMatchStatus(MatchStatus.FINISHED_PENDING)).toBe(false);
  });
});
