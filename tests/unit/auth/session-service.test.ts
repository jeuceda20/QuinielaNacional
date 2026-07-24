import { describe, expect, it, vi } from "vitest";

import {
  getSessionCookieOptions,
  hashSessionToken,
  type SessionRepository,
  SessionService,
} from "@/modules/auth/application/session-service";

function repository(): SessionRepository {
  return {
    create: vi.fn(),
    findActiveByTokenHash: vi.fn(),
    revokeByTokenHash: vi.fn(),
    revokeOtherSessions: vi.fn(),
    revokeExpiredSessions: vi.fn(),
  };
}

describe("SessionService", () => {
  it("creates an opaque token and persists only its hash", async () => {
    const store = repository();
    const service = new SessionService(store);
    const expiresAt = new Date("2026-08-01T00:00:00.000Z");
    const session = await service.create({ userId: "user-id", expiresAt });
    expect(session.token).not.toEqual(hashSessionToken(session.token));
    expect(store.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-id", tokenHash: hashSessionToken(session.token) }),
    );
  });
  it("accepts only sessions belonging to approved accounts", async () => {
    const store = repository();
    const service = new SessionService(store);
    const now = new Date();
    (store.findActiveByTokenHash as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "s",
      userId: "u",
      expiresAt: now,
      revokedAt: null,
      user: { id: "u", role: "USER", status: "BLOCKED" },
    });
    await expect(service.validate("opaque", now)).resolves.toBeNull();
  });
  it("uses secure cookie settings in production", () => {
    expect(getSessionCookieOptions(true)).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  });
});
