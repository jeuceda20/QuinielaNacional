import { describe, expect, it, vi } from "vitest";

describe("controlled test clock", () => {
  it("uses a fixed system time", () => {
    const now = new Date("2026-08-15T00:54:59.000Z");

    vi.useFakeTimers();
    vi.setSystemTime(now);

    expect(Date.now()).toBe(now.getTime());
  });
});
