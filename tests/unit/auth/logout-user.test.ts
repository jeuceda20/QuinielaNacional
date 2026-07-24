import { describe, expect, it, vi } from "vitest";

import { LogoutUser } from "@/modules/auth/application/logout-user";

describe("LogoutUser", () => {
  it("revokes the server session and clears the cookie", async () => {
    const sessions = { revoke: vi.fn() };
    const cookies = { clear: vi.fn() };
    await new LogoutUser(sessions as never, cookies).execute(
      "opaque-token",
      new Date("2026-07-24"),
    );
    expect(sessions.revoke).toHaveBeenCalledWith("opaque-token", expect.any(Date));
    expect(cookies.clear).toHaveBeenCalledOnce();
  });
  it("is safe and idempotent without a session cookie", async () => {
    const sessions = { revoke: vi.fn() };
    const cookies = { clear: vi.fn() };
    await new LogoutUser(sessions as never, cookies).execute(null, new Date());
    expect(sessions.revoke).not.toHaveBeenCalled();
    expect(cookies.clear).toHaveBeenCalledOnce();
  });
});
