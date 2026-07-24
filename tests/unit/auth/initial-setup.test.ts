import { describe, expect, it, vi } from "vitest";

import {
  InitialSetup,
  InitialSetupError,
  initialSetupSchema,
} from "@/modules/auth/application/initial-setup";

describe("InitialSetup", () => {
  const input = initialSetupSchema.parse({
    firstName: "Ana",
    lastName: "López",
    nickname: "ana",
    email: "ana@example.com",
    password: "correct-horse-battery",
    favoriteTeamId: "11111111-1111-4111-8111-111111111111",
    setupToken: "setup-secret",
  });
  it("creates the first super administrator through the atomic repository", async () => {
    const repository = { createFirstSuperAdmin: vi.fn().mockResolvedValue("CREATED") };
    const passwords = { hash: vi.fn().mockResolvedValue("hash"), verify: vi.fn() };
    await expect(
      new InitialSetup(repository, passwords, "setup-secret").execute(input, new Date()),
    ).resolves.toBeUndefined();
    expect(repository.createFirstSuperAdmin).toHaveBeenCalledWith(
      expect.objectContaining({ emailNormalized: "ana@example.com", passwordHash: "hash" }),
    );
  });
  it("rejects invalid tokens and a closed setup", async () => {
    const repository = { createFirstSuperAdmin: vi.fn().mockResolvedValue("ALREADY_COMPLETED") };
    const passwords = { hash: vi.fn(), verify: vi.fn() };
    await expect(
      new InitialSetup(repository, passwords, "different").execute(input, new Date()),
    ).rejects.toMatchObject({ code: "INVALID_SETUP_TOKEN" });
    await expect(
      new InitialSetup(repository, passwords, "setup-secret").execute(input, new Date()),
    ).rejects.toBeInstanceOf(InitialSetupError);
  });
});
