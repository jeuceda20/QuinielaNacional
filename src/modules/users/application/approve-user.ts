import {
  AuthorizationAccountStatus,
  type AuthorizationActor,
  AuthorizationRole,
  canApproveUser,
} from "@/modules/auth/domain/authorization-policies";
import type { EmailProvider } from "@/modules/email/domain/email-provider";
import type { UserRepository } from "@/modules/users/domain/user-repository";

export type ApprovalActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status:
    | "PENDING_EMAIL_CONFIRMATION"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "REJECTED"
    | "BLOCKED"
    | "DISABLED";
}>;

export type ApproveUserInput = Readonly<{
  actor: ApprovalActor;
  userId: string;
  addToActiveSeason: boolean;
  requestId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}>;

export type ApprovalPersistenceResult =
  | Readonly<{
      status: "APPROVED";
      user: Readonly<{ id: string; email: string; firstName: string }>;
      seasonId: string | null;
    }>
  | Readonly<{
      status: "ALREADY_APPROVED" | "NOT_FOUND" | "INVALID_STATE" | "ACTIVE_SEASON_NOT_FOUND";
    }>;

export interface UserApprovalRepository {
  approve(input: ApproveUserInput & { now: Date }): Promise<ApprovalPersistenceResult>;
}

export class ApproveUserError extends Error {
  public constructor(
    public readonly code:
      | "FORBIDDEN"
      | "SELF_APPROVAL_NOT_ALLOWED"
      | "USER_NOT_FOUND"
      | "INVALID_USER_STATE"
      | "ACTIVE_SEASON_NOT_FOUND",
  ) {
    super("No fue posible aprobar al usuario.");
    this.name = "ApproveUserError";
  }
}

function asAuthorizationActor(actor: ApprovalActor): AuthorizationActor {
  return {
    role: AuthorizationRole[actor.role],
    status: AuthorizationAccountStatus[actor.status],
  };
}

export class ApproveUser {
  public constructor(
    private readonly users: UserRepository,
    private readonly approvals: UserApprovalRepository,
    _emails?: EmailProvider,
  ) {}

  public async execute(input: ApproveUserInput, now: Date): Promise<{ alreadyApproved: boolean }> {
    if (input.actor.id === input.userId) throw new ApproveUserError("SELF_APPROVAL_NOT_ALLOWED");

    const target = await this.users.findById(input.userId);
    if (!target) throw new ApproveUserError("USER_NOT_FOUND");
    if (
      !canApproveUser(asAuthorizationActor(input.actor), {
        role: AuthorizationRole[target.role],
        status: AuthorizationAccountStatus[target.status],
      })
    ) {
      throw new ApproveUserError(
        input.actor.status === "APPROVED" && input.actor.role !== "USER"
          ? "INVALID_USER_STATE"
          : "FORBIDDEN",
      );
    }

    const result = await this.approvals.approve({ ...input, now });
    if (result.status === "NOT_FOUND") throw new ApproveUserError("USER_NOT_FOUND");
    if (result.status === "INVALID_STATE") throw new ApproveUserError("INVALID_USER_STATE");
    if (result.status === "ACTIVE_SEASON_NOT_FOUND")
      throw new ApproveUserError("ACTIVE_SEASON_NOT_FOUND");
    if (result.status === "ALREADY_APPROVED") return { alreadyApproved: true };
    if (result.status !== "APPROVED") throw new ApproveUserError("INVALID_USER_STATE");

    return { alreadyApproved: false };
  }
}
