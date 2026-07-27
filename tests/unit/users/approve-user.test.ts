import { describe, expect, it, vi } from "vitest";

import { ApproveUser, ApproveUserError } from "@/modules/users/application/approve-user";
import type { UserRepository } from "@/modules/users/domain/user-repository";

const actor = { id: "admin-id", role: "ADMIN" as const, status: "APPROVED" as const };
const target = { id: "user-id", role: "USER" as const, status: "PENDING_APPROVAL" as const };

function createUsers(overrides: Record<string, unknown> = {}) {
  return { findById: vi.fn().mockResolvedValue({ ...target, ...overrides }) } as unknown as UserRepository;
}

describe("ApproveUser", () => {
  it("approves a pending user and optionally joins the active season", async () => {
    const approvals = { approve: vi.fn().mockResolvedValue({ status: "APPROVED", user: { id: "user-id", email: "user@example.com", firstName: "Ana" }, seasonId: "season-id" }) };
    await expect(new ApproveUser(createUsers(), approvals).execute({ actor, userId: "user-id", addToActiveSeason: true, requestId: "request-id" }, new Date())).resolves.toEqual({ alreadyApproved: false });
    expect(approvals.approve).toHaveBeenCalledWith(expect.objectContaining({ addToActiveSeason: true, requestId: "request-id" }));
  });

  it("rejects unauthorized actors, invalid account states, and self-approval", async () => {
    const approvals = { approve: vi.fn() };
    await expect(new ApproveUser(createUsers(), approvals).execute({ actor: { ...actor, role: "USER" }, userId: "user-id", addToActiveSeason: false }, new Date())).rejects.toMatchObject({ code: "FORBIDDEN" } satisfies Partial<ApproveUserError>);
    await expect(new ApproveUser(createUsers({ status: "PENDING_EMAIL_CONFIRMATION" }), approvals).execute({ actor, userId: "user-id", addToActiveSeason: false }, new Date())).rejects.toMatchObject({ code: "INVALID_USER_STATE" } satisfies Partial<ApproveUserError>);
    await expect(new ApproveUser(createUsers(), approvals).execute({ actor, userId: "admin-id", addToActiveSeason: false }, new Date())).rejects.toMatchObject({ code: "SELF_APPROVAL_NOT_ALLOWED" } satisfies Partial<ApproveUserError>);
  });

  it("is idempotent when the account is already approved", async () => {
    await expect(new ApproveUser(createUsers(), { approve: vi.fn().mockResolvedValue({ status: "ALREADY_APPROVED" }) }).execute({ actor, userId: "user-id", addToActiveSeason: false }, new Date())).resolves.toEqual({ alreadyApproved: true });
  });
});
