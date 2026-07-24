import {
  AuthorizationAccountStatus,
  type AuthorizationActor,
  AuthorizationRole,
  canManageAdministratorRole,
} from "@/modules/auth/domain/authorization-policies";
import type { ApprovalActor } from "@/modules/users/application/approve-user";
import type { UserRepository } from "@/modules/users/domain/user-repository";

export type ManageAdministratorRoleInput = Readonly<{
  actor: ApprovalActor;
  userId: string;
  newRole: "USER" | "ADMIN";
  reason?: string | null;
  requestId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}>;

export type AdministratorRolePersistenceResult =
  | Readonly<{ status: "CHANGED" }>
  | Readonly<{ status: "NOT_FOUND" | "INVALID_STATE" | "ALREADY_ASSIGNED" }>;

export interface AdministratorRoleRepository {
  changeRole(
    input: ManageAdministratorRoleInput & { now: Date },
  ): Promise<AdministratorRolePersistenceResult>;
}

export class ManageAdministratorRoleError extends Error {
  public constructor(
    public readonly code:
      "FORBIDDEN" | "USER_NOT_FOUND" | "INVALID_USER_STATE" | "ROLE_ALREADY_ASSIGNED",
  ) {
    super("No fue posible actualizar el rol administrativo.");
    this.name = "ManageAdministratorRoleError";
  }
}

function asAuthorizationActor(actor: ApprovalActor): AuthorizationActor {
  return {
    role: AuthorizationRole[actor.role],
    status: AuthorizationAccountStatus[actor.status],
  };
}

export class ManageAdministratorRole {
  public constructor(
    private readonly users: UserRepository,
    private readonly roles: AdministratorRoleRepository,
  ) {}

  public async execute(input: ManageAdministratorRoleInput, now: Date): Promise<void> {
    const target = await this.users.findById(input.userId);
    if (!target) throw new ManageAdministratorRoleError("USER_NOT_FOUND");
    if (
      !canManageAdministratorRole(
        asAuthorizationActor(input.actor),
        { role: AuthorizationRole[target.role], status: AuthorizationAccountStatus[target.status] },
        AuthorizationRole[input.newRole],
      )
    ) {
      const isApprovedSuperAdmin =
        input.actor.role === "SUPER_ADMIN" && input.actor.status === "APPROVED";
      throw new ManageAdministratorRoleError(
        isApprovedSuperAdmin ? "INVALID_USER_STATE" : "FORBIDDEN",
      );
    }
    const result = await this.roles.changeRole({ ...input, now });
    if (result.status === "NOT_FOUND") throw new ManageAdministratorRoleError("USER_NOT_FOUND");
    if (result.status === "INVALID_STATE")
      throw new ManageAdministratorRoleError("INVALID_USER_STATE");
    if (result.status === "ALREADY_ASSIGNED")
      throw new ManageAdministratorRoleError("ROLE_ALREADY_ASSIGNED");
  }
}
