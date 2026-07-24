import { describe, expect, it, vi } from "vitest";

import { loginInputSchema, LoginUser } from "@/modules/auth/application/login-user";

describe("LoginUser", () => {
  const input = loginInputSchema.parse({
    email: "ana@example.com",
    password: "password",
    ipAddress: null,
    userAgent: null,
  });
  it("creates a new opaque session only for approved credentials", async () => {
    const users = {
      findByNormalizedEmail: vi
        .fn()
        .mockResolvedValue({ id: "u", passwordHash: "hash", status: "APPROVED" }),
    };
    const passwords = { hash: vi.fn(), verify: vi.fn().mockResolvedValue(true) };
    const sessions = {
      create: vi.fn().mockResolvedValue({ token: "opaque", expiresAt: new Date("2026-08-01") }),
    };
    const service = new LoginUser(
      users as never,
      passwords,
      sessions as never,
      { consume: vi.fn().mockResolvedValue(true) },
      "fallback",
    );
    await expect(service.execute(input, new Date("2026-07-24"))).resolves.toMatchObject({
      status: "AUTHENTICATED",
      token: "opaque",
    });
  });
  it("uses the fallback hash and generic result for unknown credentials", async () => {
    const users = { findByNormalizedEmail: vi.fn().mockResolvedValue(null) };
    const passwords = { hash: vi.fn(), verify: vi.fn().mockResolvedValue(false) };
    const service = new LoginUser(
      users as never,
      passwords,
      { create: vi.fn() } as never,
      { consume: vi.fn().mockResolvedValue(true) },
      "fallback-hash",
    );
    await expect(service.execute(input, new Date())).resolves.toEqual({ status: "INVALID" });
    expect(passwords.verify).toHaveBeenCalledWith("password", "fallback-hash");
  });
  it("does not create sessions for pending accounts", async () => {
    const users = {
      findByNormalizedEmail: vi
        .fn()
        .mockResolvedValue({ passwordHash: "hash", status: "PENDING_APPROVAL" }),
    };
    const passwords = { hash: vi.fn(), verify: vi.fn().mockResolvedValue(true) };
    const service = new LoginUser(
      users as never,
      passwords,
      { create: vi.fn() } as never,
      { consume: vi.fn().mockResolvedValue(true) },
      "fallback",
    );
    await expect(service.execute(input, new Date())).resolves.toEqual({
      status: "PENDING_APPROVAL",
    });
  });
});
