import { describe, expect, it, vi } from "vitest";

import {
  ConfirmEmail,
  type EmailConfirmationRepository,
  InvalidEmailConfirmationTokenError,
} from "@/modules/auth/application/confirm-email";

const token = "a".repeat(43);
describe("ConfirmEmail", () => {
  it("confirms a valid token by using only its hash", async () => {
    const repository: EmailConfirmationRepository = {
      confirm: vi.fn().mockResolvedValue("CONFIRMED"),
    };
    await expect(new ConfirmEmail(repository).execute(token, new Date())).resolves.toBe(
      "CONFIRMED",
    );
    expect(repository.confirm).toHaveBeenCalledWith(
      expect.not.stringContaining(token),
      expect.any(Date),
    );
  });
  it("returns a safe error for invalid or expired tokens", async () => {
    const repository: EmailConfirmationRepository = {
      confirm: vi.fn().mockResolvedValue("INVALID"),
    };
    await expect(new ConfirmEmail(repository).execute(token, new Date())).rejects.toBeInstanceOf(
      InvalidEmailConfirmationTokenError,
    );
    await expect(new ConfirmEmail(repository).execute("bad", new Date())).rejects.toBeInstanceOf(
      InvalidEmailConfirmationTokenError,
    );
  });
  it("keeps an already confirmed account idempotent", async () => {
    const repository: EmailConfirmationRepository = {
      confirm: vi.fn().mockResolvedValue("ALREADY_CONFIRMED"),
    };
    await expect(new ConfirmEmail(repository).execute(token, new Date())).resolves.toBe(
      "ALREADY_CONFIRMED",
    );
  });
});
