import { describe, expect, it } from "vitest";

import {
  AuthorizationAccountStatus,
  type AuthorizationActor,
  AuthorizationRole,
  type AuthorizationTarget,
  canApproveUser,
  canManageAdministratorRole,
  canManageMatch,
  canManageUserLifecycle,
  canProcessResult,
  canPromoteAdmin,
  canUseDiagnostics,
  UserLifecycleAction,
} from "@/modules/auth/domain/authorization-policies";
import { MatchStatus } from "@/modules/matches/domain/match-status-machine";

const approvedUser: AuthorizationActor = {
  role: AuthorizationRole.USER,
  status: AuthorizationAccountStatus.APPROVED,
};
const approvedAdmin: AuthorizationActor = {
  role: AuthorizationRole.ADMIN,
  status: AuthorizationAccountStatus.APPROVED,
};
const approvedSuperAdmin: AuthorizationActor = {
  role: AuthorizationRole.SUPER_ADMIN,
  status: AuthorizationAccountStatus.APPROVED,
};
const blockedAdmin: AuthorizationActor = {
  role: AuthorizationRole.ADMIN,
  status: AuthorizationAccountStatus.BLOCKED,
};
const pendingApprovalUser: AuthorizationTarget = {
  role: AuthorizationRole.USER,
  status: AuthorizationAccountStatus.PENDING_APPROVAL,
};

describe("authorization policies", () => {
  it("allows approved administrators to approve users pending approval", () => {
    expect(canApproveUser(approvedAdmin, pendingApprovalUser)).toBe(true);
    expect(canApproveUser(approvedSuperAdmin, pendingApprovalUser)).toBe(true);
  });

  it("rejects user actors and targets that are not pending approval", () => {
    expect(canApproveUser(approvedUser, pendingApprovalUser)).toBe(false);
    expect(canApproveUser(approvedAdmin, approvedUser)).toBe(false);
  });

  it("allows approved administrators to manage non-terminal matches", () => {
    expect(canManageMatch(approvedAdmin, MatchStatus.SCHEDULED)).toBe(true);
    expect(canManageMatch(approvedSuperAdmin, MatchStatus.SUSPENDED)).toBe(true);
  });

  it("rejects match management for terminal matches", () => {
    expect(canManageMatch(approvedAdmin, MatchStatus.PROCESSED)).toBe(false);
    expect(canManageMatch(approvedAdmin, MatchStatus.CANCELLED)).toBe(false);
  });

  it("allows approved administrators to process only finished pending matches", () => {
    expect(canProcessResult(approvedAdmin, MatchStatus.FINISHED_PENDING)).toBe(true);
    expect(canProcessResult(approvedSuperAdmin, MatchStatus.FINISHED_PENDING)).toBe(true);
    expect(canProcessResult(approvedAdmin, MatchStatus.CLOSED)).toBe(false);
  });

  it("reserves promotions for the approved super administrator", () => {
    expect(canPromoteAdmin(approvedSuperAdmin, approvedUser)).toBe(true);
    expect(canPromoteAdmin(approvedAdmin, approvedUser)).toBe(false);
    expect(canPromoteAdmin(approvedSuperAdmin, approvedAdmin)).toBe(false);
  });

  it("allows only super administrators to switch between user and administrator roles", () => {
    expect(
      canManageAdministratorRole(approvedSuperAdmin, approvedUser, AuthorizationRole.ADMIN),
    ).toBe(true);
    expect(
      canManageAdministratorRole(approvedSuperAdmin, approvedAdmin, AuthorizationRole.USER),
    ).toBe(true);
    expect(canManageAdministratorRole(approvedAdmin, approvedUser, AuthorizationRole.ADMIN)).toBe(
      false,
    );
    expect(
      canManageAdministratorRole(approvedSuperAdmin, approvedSuperAdmin, AuthorizationRole.ADMIN),
    ).toBe(false);
  });

  it("allows each lifecycle action only from its expected account state", () => {
    expect(
      canManageUserLifecycle(approvedAdmin, pendingApprovalUser, UserLifecycleAction.REJECT),
    ).toBe(true);
    expect(canManageUserLifecycle(approvedAdmin, approvedUser, UserLifecycleAction.BLOCK)).toBe(
      true,
    );
    expect(canManageUserLifecycle(approvedAdmin, approvedUser, UserLifecycleAction.DISABLE)).toBe(
      true,
    );
    expect(
      canManageUserLifecycle(
        approvedAdmin,
        { role: AuthorizationRole.USER, status: AuthorizationAccountStatus.BLOCKED },
        UserLifecycleAction.UNBLOCK,
      ),
    ).toBe(true);
    expect(
      canManageUserLifecycle(
        approvedAdmin,
        { role: AuthorizationRole.USER, status: AuthorizationAccountStatus.DISABLED },
        UserLifecycleAction.ENABLE,
      ),
    ).toBe(true);
    expect(canManageUserLifecycle(approvedAdmin, approvedUser, UserLifecycleAction.REJECT)).toBe(
      false,
    );
  });

  it("prevents administrators from changing a super administrator lifecycle", () => {
    expect(
      canManageUserLifecycle(
        approvedAdmin,
        { role: AuthorizationRole.SUPER_ADMIN, status: AuthorizationAccountStatus.APPROVED },
        UserLifecycleAction.BLOCK,
      ),
    ).toBe(false);
  });

  it("requires an approved super administrator and enabled diagnostics", () => {
    expect(canUseDiagnostics(approvedSuperAdmin, true)).toBe(true);
    expect(canUseDiagnostics(approvedAdmin, true)).toBe(false);
    expect(canUseDiagnostics(approvedSuperAdmin, false)).toBe(false);
  });

  it("rejects every administrative policy for a blocked account", () => {
    expect(canApproveUser(blockedAdmin, pendingApprovalUser)).toBe(false);
    expect(canManageMatch(blockedAdmin, MatchStatus.SCHEDULED)).toBe(false);
    expect(canProcessResult(blockedAdmin, MatchStatus.FINISHED_PENDING)).toBe(false);
    expect(canUseDiagnostics(blockedAdmin, true)).toBe(false);
  });
});
