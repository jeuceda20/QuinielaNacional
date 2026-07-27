import { describe, expect, it, vi } from "vitest";

import type { CreateUserPersistenceInput } from "@/modules/users/domain/user-repository";
import {
  PrismaUserRepository,
  type UserRepositoryDatabase,
} from "@/modules/users/infrastructure/prisma-user-repository";

import type { User as PrismaUser } from "@/generated/prisma/client";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

const user: PrismaUser = {
  id: "1c2d3e4f-1111-2222-3333-444444444444",
  firstName: "Ana",
  lastName: "López",
  nickname: "analopez",
  nicknameNormalized: "analopez",
  email: "ana@example.com",
  emailNormalized: "ana@example.com",
  passwordHash: "password-hash",
  mustChangePassword: false,
  role: "USER",
  status: "PENDING_EMAIL_CONFIRMATION",
  approvedAt: null,
  approvedById: null,
  rejectedAt: null,
  rejectedById: null,
  rejectionReason: null,
  blockedAt: null,
  blockedById: null,
  blockReason: null,
  favoriteTeamId: null,
  isTestUser: false,
  createdAt: new Date("2026-07-24T00:00:00.000Z"),
  updatedAt: new Date("2026-07-24T00:00:00.000Z"),
  deletedAt: null,
};

const createInput: CreateUserPersistenceInput = {
  firstName: user.firstName,
  lastName: user.lastName,
  nickname: user.nickname,
  nicknameNormalized: user.nicknameNormalized,
  email: user.email,
  emailNormalized: user.emailNormalized,
  passwordHash: user.passwordHash,
};

function createRepository() {
  const database = {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
    },
  } as unknown as UserRepositoryDatabase;

  return { database, repository: new PrismaUserRepository(database) };
}

describe("PrismaUserRepository", () => {
  it("finds a non-deleted user by normalized email and maps it to the domain entity", async () => {
    const { database, repository } = createRepository();
    const findFirst = database.user.findFirst as ReturnType<typeof vi.fn>;
    findFirst.mockResolvedValue(user);

    await expect(repository.findByNormalizedEmail(user.emailNormalized)).resolves.toMatchObject({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
    });
    expect(findFirst).toHaveBeenCalledWith({
      where: { emailNormalized: user.emailNormalized, deletedAt: null },
    });
  });

  it("finds a non-deleted user by normalized nickname", async () => {
    const { database, repository } = createRepository();
    const findFirst = database.user.findFirst as ReturnType<typeof vi.fn>;
    findFirst.mockResolvedValue(null);

    await expect(repository.findByNormalizedNickname(user.nicknameNormalized)).resolves.toBeNull();
    expect(findFirst).toHaveBeenCalledWith({
      where: { nicknameNormalized: user.nicknameNormalized, deletedAt: null },
    });
  });

  it("creates a user and maps the persisted record", async () => {
    const { database, repository } = createRepository();
    const create = database.user.create as ReturnType<typeof vi.fn>;
    create.mockResolvedValue(user);

    await expect(repository.create(createInput)).resolves.toMatchObject({ id: user.id });
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining(createInput),
    });
  });

  it("changes status and role only for non-deleted users", async () => {
    const { database, repository } = createRepository();
    const updateMany = database.user.updateMany as ReturnType<typeof vi.fn>;
    updateMany.mockResolvedValue({ count: 1 });

    await expect(repository.updateStatus(user.id, "PENDING_APPROVAL")).resolves.toBe(true);
    await expect(repository.updateRole(user.id, "ADMIN")).resolves.toBe(true);
    expect(updateMany).toHaveBeenNthCalledWith(1, {
      where: { id: user.id, deletedAt: null },
      data: { status: "PENDING_APPROVAL" },
    });
    expect(updateMany).toHaveBeenNthCalledWith(2, {
      where: { id: user.id, deletedAt: null },
      data: { role: "ADMIN" },
    });
  });

  it("soft deletes a non-deleted user and reports when it no longer exists", async () => {
    const { database, repository } = createRepository();
    const updateMany = database.user.updateMany as ReturnType<typeof vi.fn>;
    const deletedAt = new Date("2026-07-24T12:00:00.000Z");
    updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

    await expect(repository.softDelete(user.id, deletedAt)).resolves.toBe(true);
    await expect(repository.softDelete(user.id, deletedAt)).resolves.toBe(false);
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: user.id, deletedAt: null },
      data: { deletedAt },
    });
  });
});
