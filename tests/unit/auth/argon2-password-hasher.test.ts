import { describe, expect, it } from "vitest";

import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";

describe("Argon2PasswordHasher", () => {
  const hasher = new Argon2PasswordHasher();

  it("creates an Argon2id hash that differs from the plain password", async () => {
    const hash = await hasher.hash("correct-horse-battery-staple");

    expect(hash).not.toBe("correct-horse-battery-staple");
    expect(hash).toMatch(/^\$argon2id\$/);
  });

  it("verifies the matching password and rejects an incorrect one", async () => {
    const hash = await hasher.hash("correct-horse-battery-staple");

    await expect(hasher.verify("correct-horse-battery-staple", hash)).resolves.toBe(true);
    await expect(hasher.verify("incorrect-password", hash)).resolves.toBe(false);
  });

  it("uses a salt so separate hashes can differ", async () => {
    const [firstHash, secondHash] = await Promise.all([
      hasher.hash("correct-horse-battery-staple"),
      hasher.hash("correct-horse-battery-staple"),
    ]);

    expect(firstHash).not.toBe(secondHash);
  });

  it("returns false for a malformed hash", async () => {
    await expect(hasher.verify("correct-horse-battery-staple", "not-a-hash")).resolves.toBe(false);
  });
});
