import {
  AuthorizationAccountStatus,
  type AuthorizationActor,
  AuthorizationRole,
  canManageUserLifecycle,
  UserLifecycleAction,
} from "@/modules/auth/domain/authorization-policies";
import type { ApprovalActor } from "@/modules/users/application/approve-user";
import type { UserRepository } from "@/modules/users/domain/user-repository";

export type ManageUserLifecycleInput = Readonly<{
  actor: ApprovalActor;
  userId: string;
  action: UserLifecycleAction;
  reason?: string | null;
  requestId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}>;

export type LifecyclePersistenceResult =
  Readonly<{ status: "CHANGED" }> | Readonly<{ status: "NOT_FOUND" | "INVALID_STATE" }>;

export interface UserLifecycleRepository {
  apply(input: ManageUserLifecycleInput & { now: Date }): Promise<LifecyclePersistenceResult>;
}

export class ManageUserLifecycleError extends Error {
  public constructor(
    public readonly code:
      "FORBIDDEN" | "SELF_MANAGEMENT_NOT_ALLOWED" | "USER_NOT_FOUND" | "INVALID_USER_STATE",
  ) {
    super("No fue posible actualizar el estado del usuario.");
    this.name = "ManageUserLifecycleError";
  }
}

function asAuthorizationActor(actor: ApprovalActor): AuthorizationActor {
  return {
    role: AuthorizationRole[actor.role],
    status: AuthorizationAccountStatus[actor.status],
  };
}

export class ManageUserLifecycle {
  public constructor(
    private readonly users: UserRepository,
    private readonly lifecycle: UserLifecycleRepository,
  ) {}

  public async execute(input: ManageUserLifecycleInput, now: Date): Promise<void> {
    if (input.actor.id === input.userId)
      throw new ManageUserLifecycleError("SELF_MANAGEMENT_NOT_ALLOWED");
    const target = await this.users.findById(input.userId);
    if (!target) throw new ManageUserLifecycleError("USER_NOT_FOUND");
    if (
      !canManageUserLifecycle(
        asAuthorizationActor(input.actor),
        { role: AuthorizationRole[target.role], status: AuthorizationAccountStatus[target.status] },
        input.action,
      )
    ) {
      const actorCanManage =
        input.actor.status === "APPROVED" &&
        (input.actor.role === "ADMIN" || input.actor.role === "SUPER_ADMIN");
      throw new ManageUserLifecycleError(actorCanManage ? "INVALID_USER_STATE" : "FORBIDDEN");
    }
    const result = await this.lifecycle.apply({ ...input, now });
    if (result.status === "NOT_FOUND") throw new ManageUserLifecycleError("USER_NOT_FOUND");
    if (result.status === "INVALID_STATE") throw new ManageUserLifecycleError("INVALID_USER_STATE");
  }
}
