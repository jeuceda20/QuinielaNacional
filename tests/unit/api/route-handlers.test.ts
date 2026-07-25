import { NextRequest } from "next/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auditCount: vi.fn(),
  auditFindMany: vi.fn(),
  getApiSession: vi.fn(),
  getSettings: vi.fn(),
  listTeams: vi.fn(),
  revalidatePredictionCaches: vi.fn(),
  savePrediction: vi.fn(),
  userFindFirst: vi.fn(),
}));

vi.mock("@/lib/api/session", () => ({
  getApiSession: mocks.getApiSession,
  hasApiRole: (session: { user: { role: string } }, allowedRoles: readonly string[]) =>
    allowedRoles.includes(session.user.role),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    auditLog: { count: mocks.auditCount, findMany: mocks.auditFindMany },
    user: { findFirst: mocks.userFindFirst },
  },
}));
vi.mock("@/modules/settings/infrastructure/prisma-public-settings-repository", () => ({
  PrismaPublicSettingsRepository: class {
    get = mocks.getSettings;
  },
}));
vi.mock("@/modules/sports/infrastructure/prisma-sports-repositories", () => ({
  PrismaTeamRepository: class {
    listActive = mocks.listTeams;
  },
}));
vi.mock("@/modules/predictions/application/save-prediction", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/modules/predictions/application/save-prediction")>()),
  SavePredictionService: class {
    execute = mocks.savePrediction;
  },
}));
vi.mock("@/modules/predictions/infrastructure/prediction-cache", () => ({
  revalidatePredictionCaches: mocks.revalidatePredictionCaches,
}));
vi.mock("@/modules/predictions/infrastructure/prisma-save-prediction-repository", () => ({
  PrismaSavePredictionRepository: class {},
}));

import { GET as getAudit } from "@/app/api/v1/admin/audit/route";
import { GET as getCurrentUser } from "@/app/api/v1/auth/me/route";
import { GET as getHealth } from "@/app/api/v1/health/route";
import { PUT as savePrediction } from "@/app/api/v1/matches/[matchId]/prediction/route";
import { GET as getPublicConfig } from "@/app/api/v1/public/config/route";
import { GET as getPublicTeams } from "@/app/api/v1/public/teams/route";

const request = (path: string) => new NextRequest(`https://app.example.invalid${path}`);

describe("API route handlers", () => {
  beforeEach(() => {
    mocks.getApiSession.mockReset();
    mocks.getSettings.mockReset();
    mocks.listTeams.mockReset();
    mocks.userFindFirst.mockReset();
    mocks.revalidatePredictionCaches.mockReset();
    mocks.savePrediction.mockReset();
    mocks.auditCount.mockReset();
    mocks.auditFindMany.mockReset();
  });

  it("returns a minimal public health contract without infrastructure details", async () => {
    const response = getHealth();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { status: "ok", timestamp: expect.any(String) },
    });
  });

  it("returns only public configuration and active team DTOs", async () => {
    mocks.getSettings.mockResolvedValue({ name: "Kickoff", registrationEnabled: false });
    mocks.listTeams.mockResolvedValue([
      {
        id: "team-id",
        name: "Olimpia",
        shortName: "OLI",
        slug: "olimpia",
        logoPath: "/teams/olimpia.png",
        isActive: true,
        displayOrder: 1,
      },
    ]);

    const [config, teams] = await Promise.all([getPublicConfig(), getPublicTeams()]);

    await expect(config.json()).resolves.toEqual({
      success: true,
      data: {
        applicationName: "Kickoff",
        logoPath: "/branding/logo.png",
        registrationEnabled: false,
        maintenanceMode: false,
        timezone: "America/Tegucigalpa",
      },
    });
    await expect(teams.json()).resolves.toEqual({
      success: true,
      data: [
        {
          id: "team-id",
          name: "Olimpia",
          shortName: "OLI",
          slug: "olimpia",
          logoPath: "/teams/olimpia.png",
        },
      ],
    });
  });

  it("rejects an unauthenticated current-user request with the documented error envelope", async () => {
    mocks.getApiSession.mockResolvedValue(null);

    const response = await getCurrentUser(request("/api/v1/auth/me"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: { code: "AUTH_SESSION_EXPIRED" },
      requestId: expect.any(String),
    });
  });

  it("returns the current user without credentials or session material", async () => {
    mocks.getApiSession.mockResolvedValue({ user: { id: "user-id", role: "USER" } });
    mocks.userFindFirst.mockResolvedValue({
      id: "user-id",
      firstName: "Ana",
      lastName: "Test",
      nickname: "ana",
      email: "ana@example.invalid",
      role: "USER",
      favoriteTeam: { id: "team-id", name: "Olimpia", logoPath: "/teams/olimpia.png" },
    });

    const response = await getCurrentUser(request("/api/v1/auth/me"));

    await expect(response.json()).resolves.toEqual({
      success: true,
      data: {
        id: "user-id",
        firstName: "Ana",
        lastName: "Test",
        nickname: "ana",
        email: "ana@example.invalid",
        role: "USER",
        favoriteTeam: { id: "team-id", name: "Olimpia", logoPath: "/teams/olimpia.png" },
      },
    });
  });

  it("enforces the admin role before accessing audit data", async () => {
    mocks.getApiSession.mockResolvedValue({ user: { id: "user-id", role: "USER" } });

    const response = await getAudit(request("/api/v1/admin/audit"));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: { code: "FORBIDDEN" },
    });
    expect(mocks.auditFindMany).not.toHaveBeenCalled();
  });

  it("validates audit pagination and redacts sensitive values in successful responses", async () => {
    mocks.getApiSession.mockResolvedValue({ user: { id: "admin-id", role: "ADMIN" } });
    mocks.auditCount.mockResolvedValue(1);
    mocks.auditFindMany.mockResolvedValue([
      {
        id: "audit-id",
        actorUserId: "admin-id",
        actorRole: "ADMIN",
        action: "USER_APPROVED",
        entityType: "USER",
        entityId: "user-id",
        beforeJson: { password: "never-return-this", status: "PENDING_APPROVAL" },
        afterJson: { status: "APPROVED" },
        metadataJson: { token: "never-return-this", source: "api" },
        createdAt: new Date("2026-08-15T00:00:00.000Z"),
        requestId: "req-test",
      },
    ]);

    const response = await getAudit(request("/api/v1/admin/audit?page=1&pageSize=20"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: [
        {
          id: "audit-id",
          actorUserId: "admin-id",
          actorRole: "ADMIN",
          action: "USER_APPROVED",
          entityType: "USER",
          entityId: "user-id",
          before: { status: "PENDING_APPROVAL" },
          after: { status: "APPROVED" },
          metadata: { source: "api" },
          createdAt: "2026-08-15T00:00:00.000Z",
          requestId: "req-test",
        },
      ],
      meta: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("validates prediction JSON before calling the application service", async () => {
    mocks.getApiSession.mockResolvedValue({ user: { id: "user-id", role: "USER" } });

    const response = await savePrediction(
      new NextRequest("https://app.example.invalid/api/v1/matches/not-a-uuid/prediction", {
        method: "PUT",
        body: JSON.stringify({ homeGoals: -1, awayGoals: 1 }),
      }),
      { params: Promise.resolve({ matchId: "not-a-uuid" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: { code: "VALIDATION_ERROR" },
    });
    expect(mocks.savePrediction).not.toHaveBeenCalled();
  });

  it("maps the server-side prediction closing rule to its HTTP contract", async () => {
    const matchId = "b105eeea-0e6e-4f29-9d95-6c772c47bb7d";
    mocks.getApiSession.mockResolvedValue({ user: { id: "user-id", role: "USER" } });
    mocks.savePrediction.mockRejectedValue(new Error("MATCH_CLOSED"));

    const response = await savePrediction(
      new NextRequest(`https://app.example.invalid/api/v1/matches/${matchId}/prediction`, {
        method: "PUT",
        body: JSON.stringify({ homeGoals: 2, awayGoals: 1 }),
      }),
      { params: Promise.resolve({ matchId }) },
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: { code: "PREDICTION_CLOSED" },
    });
  });
});
