import { describe, expect, it, vi } from "vitest";

import {
  createDownloadToken,
  SecureDownloadAuthorizer,
  verifyDownloadToken,
} from "@/modules/exports/application/secure-download";
describe("secure download", () => {
  it("requires the intended user, a valid signature and an unexpired token", async () => {
    const now = new Date("2026-07-24T00:00:00Z"),
      secret = "test-secret",
      token = createDownloadToken(
        { exportRunId: "run-1", userId: "user-1", expiresAt: now.getTime() + 900000 },
        secret,
      ),
      audit = { recordDownload: vi.fn() },
      authorizer = new SecureDownloadAuthorizer(audit, secret, () => now);
    expect(verifyDownloadToken(token, "other", secret, now)).toBeNull();
    await expect(authorizer.authorize(token, "user-1", "req-1")).resolves.toBe("run-1");
    expect(audit.recordDownload).toHaveBeenCalledWith({
      exportRunId: "run-1",
      userId: "user-1",
      requestId: "req-1",
    });
    expect(
      verifyDownloadToken(
        createDownloadToken(
          { exportRunId: "run-1", userId: "user-1", expiresAt: now.getTime() },
          secret,
        ),
        "user-1",
        secret,
        now,
      ),
    ).toBeNull();
  });
});
