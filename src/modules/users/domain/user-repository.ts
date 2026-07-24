export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export type UserStatus =
  | "PENDING_EMAIL_CONFIRMATION"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "BLOCKED"
  | "DISABLED";

export type UserEntity = Readonly<{
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  nicknameNormalized: string;
  email: string;
  emailNormalized: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: Date | null;
  approvedAt: Date | null;
  approvedById: string | null;
  rejectedAt: Date | null;
  rejectedById: string | null;
  rejectionReason: string | null;
  blockedAt: Date | null;
  blockedById: string | null;
  blockReason: string | null;
  favoriteTeamId: string | null;
  isTestUser: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}>;

export type CreateUserPersistenceInput = Readonly<{
  firstName: string;
  lastName: string;
  nickname: string;
  nicknameNormalized: string;
  email: string;
  emailNormalized: string;
  passwordHash: string;
  favoriteTeamId?: string | null;
  isTestUser?: boolean;
  role?: UserRole;
  status?: UserStatus;
}>;

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByNormalizedEmail(emailNormalized: string): Promise<UserEntity | null>;
  findByNormalizedNickname(nicknameNormalized: string): Promise<UserEntity | null>;
  create(input: CreateUserPersistenceInput): Promise<UserEntity>;
  updateStatus(id: string, status: UserStatus): Promise<boolean>;
  updateRole(id: string, role: UserRole): Promise<boolean>;
  softDelete(id: string, deletedAt: Date): Promise<boolean>;
}
