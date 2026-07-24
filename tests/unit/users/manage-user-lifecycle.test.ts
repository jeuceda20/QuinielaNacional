import { describe, expect, it, vi } from "vitest";

import { UserLifecycleAction } from "@/modules/auth/domain/authorization-policies";
import {
  ManageUserLifecycle,
  ManageUserLifecycleError,
} from "@/modules/users/application/manage-user-lifecycle";
import type { UserRepository } from "@/modules/users/domain/user-repository";

const actor = { id: "admin-id", role: "ADMIN" as const, status: "APPROVED" as const };
const target = { id: "user-id", role: "USER" as const, status: "APPROVED" as const };

function users(overrides: Record<string, unknown> = {}) {
  return {
    findById: vi.fn().mockResolvedValue({ ...target, ...overrides }),
  } as unknown as UserRepository;
}

describe("ManageUserLifecycle", () => {
  it.each([
    [UserLifecycleAction.REJECT, { status: "PENDING_APPROVAL" }],
    [UserLifecycleAction.BLOCK, {}],
    [UserLifecycleAction.UNBLOCK, { status: "BLOCKED" }],
    [UserLifecycleAction.DISABLE, {}],
    [UserLifecycleAction.ENABLE, { status: "DISABLED" }],
  ] as const)("applies %s through the transactional repository", async (action, overrides) => {
    const lifecycle = { apply: vi.fn().mockResolvedValue({ status: "CHANGED" }) };
    await expect(
      new ManageUserLifecycle(users(overrides), lifecycle).execute(
        { actor, userId: "user-id", action, reason: "Motivo" },
        new Date(),
      ),
    ).resolves.toBeUndefined();
    expect(lifecycle.apply).toHaveBeenCalledWith(
      expect.objectContaining({ action, reason: "Motivo" }),
    );
  });

  it("forbids regular users, self-management, invalid transitions, and admins targeting superadmins", async () => {
    const lifecycle = { apply: vi.fn() };
    await expect(
      new ManageUserLifecycle(users(), lifecycle).execute(
        { actor: { ...actor, role: "USER" }, userId: "user-id", action: UserLifecycleAction.BLOCK },
        new Date(),
      ),
    ).rejects.toMatchObject({ code: "FORBIDDEN" } satisfies Partial<ManageUserLifecycleError>);
    await expect(
      new ManageUserLifecycle(users(), lifecycle).execute(
        { actor, userId: "admin-id", action: UserLifecycleAction.BLOCK },
        new Date(),
      ),
    ).rejects.toMatchObject({
      code: "SELF_MANAGEMENT_NOT_ALLOWED",
    } satisfies Partial<ManageUserLifecycleError>);
    await expect(
      new ManageUserLifecycle(users({ status: "APPROVED" }), lifecycle).execute(
        { actor, userId: "user-id", action: UserLifecycleAction.REJECT },
        new Date(),
      ),
    ).rejects.toMatchObject({
      code: "INVALID_USER_STATE",
    } satisfies Partial<ManageUserLifecycleError>);
    await expect(
      new ManageUserLifecycle(users({ role: "SUPER_ADMIN" }), lifecycle).execute(
        { actor, userId: "user-id", action: UserLifecycleAction.BLOCK },
        new Date(),
      ),
    ).rejects.toMatchObject({
      code: "INVALID_USER_STATE",
    } satisfies Partial<ManageUserLifecycleError>);
  });
});
