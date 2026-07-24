import { describe, expect, it, vi } from "vitest";

import {
  ManageAdministratorRole,
  ManageAdministratorRoleError,
} from "@/modules/users/application/manage-administrator-role";
import type { UserRepository } from "@/modules/users/domain/user-repository";

const superAdmin = { id: "super-id", role: "SUPER_ADMIN" as const, status: "APPROVED" as const };
const target = { id: "user-id", role: "USER" as const, status: "APPROVED" as const };

function users(overrides: Record<string, unknown> = {}) {
  return {
    findById: vi.fn().mockResolvedValue({ ...target, ...overrides }),
  } as unknown as UserRepository;
}

describe("ManageAdministratorRole", () => {
  it("promotes an approved user and records the requested role change", async () => {
    const roles = { changeRole: vi.fn().mockResolvedValue({ status: "CHANGED" }) };
    await expect(
      new ManageAdministratorRole(users(), roles).execute(
        { actor: superAdmin, userId: "user-id", newRole: "ADMIN", reason: "Apoyo operativo" },
        new Date(),
      ),
    ).resolves.toBeUndefined();
    expect(roles.changeRole).toHaveBeenCalledWith(
      expect.objectContaining({ newRole: "ADMIN", reason: "Apoyo operativo" }),
    );
  });

  it("allows a superadmin to remove an administrator role", async () => {
    const roles = { changeRole: vi.fn().mockResolvedValue({ status: "CHANGED" }) };
    await expect(
      new ManageAdministratorRole(users({ role: "ADMIN" }), roles).execute(
        { actor: superAdmin, userId: "user-id", newRole: "USER" },
        new Date(),
      ),
    ).resolves.toBeUndefined();
  });

  it("rejects non-superadmin actors, blocked users, and superadmin targets", async () => {
    const roles = { changeRole: vi.fn() };
    await expect(
      new ManageAdministratorRole(users(), roles).execute(
        { actor: { ...superAdmin, role: "ADMIN" }, userId: "user-id", newRole: "ADMIN" },
        new Date(),
      ),
    ).rejects.toMatchObject({ code: "FORBIDDEN" } satisfies Partial<ManageAdministratorRoleError>);
    await expect(
      new ManageAdministratorRole(users({ status: "BLOCKED" }), roles).execute(
        { actor: superAdmin, userId: "user-id", newRole: "ADMIN" },
        new Date(),
      ),
    ).rejects.toMatchObject({
      code: "INVALID_USER_STATE",
    } satisfies Partial<ManageAdministratorRoleError>);
    await expect(
      new ManageAdministratorRole(users({ role: "SUPER_ADMIN" }), roles).execute(
        { actor: superAdmin, userId: "user-id", newRole: "ADMIN" },
        new Date(),
      ),
    ).rejects.toMatchObject({
      code: "INVALID_USER_STATE",
    } satisfies Partial<ManageAdministratorRoleError>);
  });

  it("surfaces idempotent role conflicts", async () => {
    await expect(
      new ManageAdministratorRole(users(), {
        changeRole: vi.fn().mockResolvedValue({ status: "ALREADY_ASSIGNED" }),
      }).execute({ actor: superAdmin, userId: "user-id", newRole: "ADMIN" }, new Date()),
    ).rejects.toMatchObject({
      code: "ROLE_ALREADY_ASSIGNED",
    } satisfies Partial<ManageAdministratorRoleError>);
  });
});
