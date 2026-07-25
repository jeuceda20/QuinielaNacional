import { describe, expect, it, vi } from "vitest";

import { RateLimiter, rateLimitRules } from "@/modules/security/application/rate-limiter";

describe("RateLimiter", () => {
  it("hashes the subject before persisting a scoped bucket", async () => {
    const repository = { consume: vi.fn().mockResolvedValue(true) };
    const limiter = new RateLimiter(repository);

    await expect(
      limiter.consume("login:email", " ANA@example.com ", rateLimitRules.loginByEmail, new Date()),
    ).resolves.toBe(true);

    expect(repository.consume).toHaveBeenCalledWith(
      expect.stringMatching(/^[a-f0-9]{64}$/),
      rateLimitRules.loginByEmail,
      expect.any(Date),
    );
    expect(repository.consume.mock.calls[0]?.[0]).not.toContain("ana@example.com");
  });

  it("uses one anonymous bucket when an address is unavailable", async () => {
    const repository = { consume: vi.fn().mockResolvedValue(false) };
    const limiter = new RateLimiter(repository);

    await expect(
      limiter.consume("registration:ip", null, rateLimitRules.registrationByIp, new Date()),
    ).resolves.toBe(false);
    expect(repository.consume).toHaveBeenCalledTimes(1);
  });
});
