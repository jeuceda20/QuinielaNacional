import type {
  CreateUserPersistenceInput,
  UserEntity,
  UserRepository,
  UserRole,
  UserStatus,
} from "@/modules/users/domain/user-repository";

import { prisma } from "@/lib/prisma";

import type { PrismaClient, User as PrismaUser } from "@/generated/prisma/client";

export type UserRepositoryDatabase = Pick<PrismaClient, "user">;

function toUserEntity(user: PrismaUser): UserEntity {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    nickname: user.nickname,
    nicknameNormalized: user.nicknameNormalized,
    email: user.email,
    emailNormalized: user.emailNormalized,
    passwordHash: user.passwordHash,
    mustChangePassword: user.mustChangePassword,
    role: user.role,
    status: user.status,
    approvedAt: user.approvedAt,
    approvedById: user.approvedById,
    rejectedAt: user.rejectedAt,
    rejectedById: user.rejectedById,
    rejectionReason: user.rejectionReason,
    blockedAt: user.blockedAt,
    blockedById: user.blockedById,
    blockReason: user.blockReason,
    favoriteTeamId: user.favoriteTeamId,
    isTestUser: user.isTestUser,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}

export class PrismaUserRepository implements UserRepository {
  public constructor(private readonly database: UserRepositoryDatabase = prisma) {}

  public async findById(id: string): Promise<UserEntity | null> {
    const user = await this.database.user.findFirst({
      where: { id, deletedAt: null },
    });

    return user ? toUserEntity(user) : null;
  }

  public async findByNormalizedEmail(emailNormalized: string): Promise<UserEntity | null> {
    const user = await this.database.user.findFirst({
      where: { emailNormalized, deletedAt: null },
    });

    return user ? toUserEntity(user) : null;
  }

  public async findByNormalizedNickname(nicknameNormalized: string): Promise<UserEntity | null> {
    const user = await this.database.user.findFirst({
      where: { nicknameNormalized, deletedAt: null },
    });

    return user ? toUserEntity(user) : null;
  }

  public async create(input: CreateUserPersistenceInput): Promise<UserEntity> {
    const user = await this.database.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        nickname: input.nickname,
        nicknameNormalized: input.nicknameNormalized,
        email: input.email,
        emailNormalized: input.emailNormalized,
        passwordHash: input.passwordHash,
        favoriteTeamId: input.favoriteTeamId,
        isTestUser: input.isTestUser,
        role: input.role,
        status: input.status,
      },
    });

    return toUserEntity(user);
  }

  public async updateStatus(id: string, status: UserStatus): Promise<boolean> {
    const result = await this.database.user.updateMany({
      where: { id, deletedAt: null },
      data: { status },
    });

    return result.count === 1;
  }

  public async updateRole(id: string, role: UserRole): Promise<boolean> {
    const result = await this.database.user.updateMany({
      where: { id, deletedAt: null },
      data: { role },
    });

    return result.count === 1;
  }

  public async softDelete(id: string, deletedAt: Date): Promise<boolean> {
    const result = await this.database.user.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt },
    });

    return result.count === 1;
  }
}
