import { describe, expect, it, vi } from "vitest";

import type { EmailProvider } from "@/modules/email/domain/email-provider";
import { ApproveUser, ApproveUserError } from "@/modules/users/application/approve-user";
import type { UserRepository } from "@/modules/users/domain/user-repository";

const actor = { id: "admin-id", role: "ADMIN" as const, status: "APPROVED" as const };
const target = {
  id: "user-id",
  role: "USER" as const,
  status: "PENDING_APPROVAL" as const,
  emailVerifiedAt: new Date(),
};

function createUsers(overrides: Record<string, unknown> = {}) {
  return {
    findById: vi.fn().mockResolvedValue({ ...target, ...overrides }),
  } as unknown as UserRepository;
}

describe("ApproveUser", () => {
  it("approves a confirmed pending user, optionally joins the season, and notifies after commit", async () => {
    const users = createUsers();
    const approvals = {
      approve: vi.fn().mockResolvedValue({
        status: "APPROVED",
        user: { id: "user-id", email: "user@example.com", firstName: "Ana" },
        seasonId: "season-id",
      }),
    };
    const emails = { sendAccountApprovedEmail: vi.fn().mockResolvedValue(undefined) };

    await expect(
      new ApproveUser(users, approvals, emails as unknown as EmailProvider).execute(
        { actor, userId: "user-id", addToActiveSeason: true, requestId: "request-id" },
        new Date("2026-07-24T00:00:00Z"),
      ),
    ).resolves.toEqual({ alreadyApproved: false });
    expect(approvals.approve).toHaveBeenCalledWith(
      expect.objectContaining({ addToActiveSeason: true, requestId: "request-id" }),
    );
    expect(emails.sendAccountApprovedEmail).toHaveBeenCalledWith({
      recipient: "user@example.com",
      recipientName: "Ana",
    });
  });

  it("rejects unauthorized actors, unconfirmed targets, and self-approval", async () => {
    const approvals = { approve: vi.fn() };
    const emails = { sendAccountApprovedEmail: vi.fn() };
    await expect(
      new ApproveUser(createUsers(), approvals, emails as unknown as EmailProvider).execute(
        { actor: { ...actor, role: "USER" }, userId: "user-id", addToActiveSeason: false },
        new Date(),
      ),
    ).rejects.toMatchObject({ code: "FORBIDDEN" } satisfies Partial<ApproveUserError>);
    await expect(
      new ApproveUser(
        createUsers({ status: "PENDING_EMAIL_CONFIRMATION" }),
        approvals,
        emails as unknown as EmailProvider,
      ).execute({ actor, userId: "user-id", addToActiveSeason: false }, new Date()),
    ).rejects.toMatchObject({ code: "INVALID_USER_STATE" } satisfies Partial<ApproveUserError>);
    await expect(
      new ApproveUser(createUsers(), approvals, emails as unknown as EmailProvider).execute(
        { actor, userId: "admin-id", addToActiveSeason: false },
        new Date(),
      ),
    ).rejects.toMatchObject({
      code: "SELF_APPROVAL_NOT_ALLOWED",
    } satisfies Partial<ApproveUserError>);
  });

  it("is idempotent and keeps an approved account when notification delivery fails", async () => {
    const emails = { sendAccountApprovedEmail: vi.fn().mockRejectedValue(new Error("smtp")) };
    await expect(
      new ApproveUser(
        createUsers(),
        {
          approve: vi.fn().mockResolvedValue({
            status: "APPROVED",
            user: { id: "user-id", email: "user@example.com", firstName: "Ana" },
            seasonId: null,
          }),
        },
        emails as unknown as EmailProvider,
      ).execute({ actor, userId: "user-id", addToActiveSeason: false }, new Date()),
    ).resolves.toEqual({ alreadyApproved: false });
    await expect(
      new ApproveUser(
        createUsers(),
        { approve: vi.fn().mockResolvedValue({ status: "ALREADY_APPROVED" }) },
        emails as unknown as EmailProvider,
      ).execute({ actor, userId: "user-id", addToActiveSeason: false }, new Date()),
    ).resolves.toEqual({ alreadyApproved: true });
  });
});
