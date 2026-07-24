import { MatchStatus } from "@/modules/matches/domain/match-status-machine";

export enum AuthorizationRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum AuthorizationAccountStatus {
  PENDING_EMAIL_CONFIRMATION = "PENDING_EMAIL_CONFIRMATION",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  BLOCKED = "BLOCKED",
  DISABLED = "DISABLED",
}

export type AuthorizationActor = Readonly<{
  role: AuthorizationRole;
  status: AuthorizationAccountStatus;
}>;

export type AuthorizationTarget = Readonly<{
  role: AuthorizationRole;
  status: AuthorizationAccountStatus;
}>;

function isApprovedAdministrator(actor: AuthorizationActor): boolean {
  return (
    actor.status === AuthorizationAccountStatus.APPROVED &&
    (actor.role === AuthorizationRole.ADMIN || actor.role === AuthorizationRole.SUPER_ADMIN)
  );
}

function isApprovedSuperAdministrator(actor: AuthorizationActor): boolean {
  return (
    actor.status === AuthorizationAccountStatus.APPROVED &&
    actor.role === AuthorizationRole.SUPER_ADMIN
  );
}

export function canApproveUser(actor: AuthorizationActor, target: AuthorizationTarget): boolean {
  return (
    isApprovedAdministrator(actor) && target.status === AuthorizationAccountStatus.PENDING_APPROVAL
  );
}

export function canManageMatch(actor: AuthorizationActor, matchStatus: MatchStatus): boolean {
  return (
    isApprovedAdministrator(actor) &&
    matchStatus !== MatchStatus.PROCESSED &&
    matchStatus !== MatchStatus.CANCELLED
  );
}

export function canProcessResult(actor: AuthorizationActor, matchStatus: MatchStatus): boolean {
  return isApprovedAdministrator(actor) && matchStatus === MatchStatus.FINISHED_PENDING;
}

export function canPromoteAdmin(actor: AuthorizationActor, target: AuthorizationTarget): boolean {
  return (
    isApprovedSuperAdministrator(actor) &&
    target.status === AuthorizationAccountStatus.APPROVED &&
    target.role === AuthorizationRole.USER
  );
}

export function canUseDiagnostics(actor: AuthorizationActor, diagnosticsEnabled: boolean): boolean {
  return isApprovedSuperAdministrator(actor) && diagnosticsEnabled;
}
