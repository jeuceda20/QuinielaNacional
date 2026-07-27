import { prisma } from "@/lib/prisma";

import type { Prisma, PrismaClient } from "@/generated/prisma/client";

export type AdminUserFilters = Readonly<{
  query?: string;
  status?: string;
  role?: string;
  teamId?: string;
  participation?: string;
  page?: number;
}>;
export type AdminDirectoryUser = Readonly<{
  id: string;
  nickname: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status:
    | "PENDING_EMAIL_CONFIRMATION"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "REJECTED"
    | "BLOCKED"
    | "DISABLED";
  team: string | null;
  createdAt: Date;
  activeSeason: string | null;
}>;
export class PrismaAdminUserDirectory {
  public constructor(private readonly database: Pick<PrismaClient, "user"> = prisma) {}
  public async list(
    filters: AdminUserFilters,
  ): Promise<{ users: AdminDirectoryUser[]; total: number; page: number }> {
    const page = Math.max(1, filters.page ?? 1);
    const take = 25;
    const where: Prisma.UserWhereInput = { deletedAt: null };
    if (filters.status) where.status = filters.status as Prisma.EnumUserStatusFilter;
    if (filters.role) where.role = filters.role as Prisma.EnumUserRoleFilter;
    if (filters.teamId) where.favoriteTeamId = filters.teamId;
    if (filters.participation === "active")
      where.seasonParticipations = { some: { season: { status: "ACTIVE", archivedAt: null } } };
    if (filters.participation === "none")
      where.seasonParticipations = { none: { season: { status: "ACTIVE", archivedAt: null } } };
    if (filters.query?.trim()) {
      const contains = { contains: filters.query.trim(), mode: "insensitive" as const };
      where.OR = [
        { nickname: contains },
        { firstName: contains },
        { lastName: contains },
        { email: contains },
      ];
    }
    const [rows, total] = await Promise.all([
      this.database.user.findMany({
        where,
        take,
        skip: (page - 1) * take,
        orderBy: { createdAt: "desc" },
        include: {
          favoriteTeam: { select: { name: true } },
          seasonParticipations: {
            where: { season: { status: "ACTIVE", archivedAt: null } },
            include: { season: { select: { name: true } } },
            take: 1,
          },
        },
      }),
      this.database.user.count({ where }),
    ]);
    return {
      page,
      total,
      users: rows.map((u) => ({
        id: u.id,
        nickname: u.nickname,
        fullName: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role,
        status: u.status,
        team: u.favoriteTeam?.name ?? null,
        createdAt: u.createdAt,
        activeSeason: u.seasonParticipations[0]?.season.name ?? null,
      })),
    };
  }
}
