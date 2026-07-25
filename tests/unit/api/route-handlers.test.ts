import { NextRequest } from "next/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auditCount: vi.fn(),
  auditFindMany: vi.fn(),
  approveUser: vi.fn(),
  confirmEmail: vi.fn(),
  createLoginService: vi.fn(),
  createPasswordRecoveryService: vi.fn(),
  createRegistrationService: vi.fn(),
  consumeRegistrationRateLimit: vi.fn(),
  getApiSession: vi.fn(),
  getSettings: vi.fn(),
  listTeams: vi.fn(),
  logout: vi.fn(),
  revalidatePredictionCaches: vi.fn(),
  savePrediction: vi.fn(),
  userFindFirst: vi.fn(),
  getClosesAt: vi.fn(),
  getOwnPrediction: vi.fn(),
  listResults: vi.fn(),
  listStandings: vi.fn(),
  processMatchResult: vi.fn(),
  recalculateSeason: vi.fn(),
  rescheduleMatch: vi.fn(),
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
vi.mock("@/modules/predictions/infrastructure/prisma-prediction-visibility-repository", () => ({
  PrismaPredictionVisibilityRepository: class {
    getClosesAt = mocks.getClosesAt;
    getOwn = mocks.getOwnPrediction;
  },
}));
vi.mock("@/modules/standings/infrastructure/prisma-public-standings-repository", () => ({
  PrismaPublicStandingsRepository: class {
    list = mocks.listStandings;
  },
}));
vi.mock("@/modules/results/infrastructure/prisma-public-results-repository", () => ({
  PrismaPublicResultsRepository: class {
    list = mocks.listResults;
  },
}));
vi.mock("@/modules/users/application/approve-user", () => ({
  ApproveUser: class {
    execute = mocks.approveUser;
  },
  ApproveUserError: class ApproveUserError extends Error {
    code = "FORBIDDEN";
  },
}));
vi.mock("@/modules/users/infrastructure/prisma-user-repository", () => ({
  PrismaUserRepository: class {},
}));
vi.mock("@/modules/users/infrastructure/prisma-user-approval-repository", () => ({
  PrismaUserApprovalRepository: class {},
}));
vi.mock("@/modules/auth/application/confirm-email", () => ({
  ConfirmEmail: class {
    execute = mocks.confirmEmail;
  },
  InvalidEmailConfirmationTokenError: class InvalidEmailConfirmationTokenError extends Error {},
}));
vi.mock("@/modules/auth/infrastructure/prisma-email-confirmation-repository", () => ({
  PrismaEmailConfirmationRepository: class {},
}));
vi.mock("@/modules/auth/application/logout-user", () => ({
  LogoutUser: class {
    execute = mocks.logout;
  },
}));
vi.mock("@/modules/auth/application/session-service", () => ({
  SessionService: class {},
  getSessionCookieOptions: () => ({ httpOnly: true, path: "/", sameSite: "lax" }),
}));
vi.mock("@/modules/auth/infrastructure/prisma-session-repository", () => ({
  PrismaSessionRepository: class {},
}));
vi.mock("@/modules/auth/infrastructure/create-auth-services", () => ({
  createLoginService: mocks.createLoginService,
  createPasswordRecoveryService: mocks.createPasswordRecoveryService,
  createRegistrationService: mocks.createRegistrationService,
  consumeRegistrationRateLimit: mocks.consumeRegistrationRateLimit,
}));
vi.mock("@/modules/results/application/process-match-result", () => ({
  ProcessMatchResultService: class {
    execute = mocks.processMatchResult;
  },
}));
vi.mock("@/modules/results/infrastructure/prisma-process-match-result-repository", () => ({
  PrismaProcessMatchResultRepository: class {},
}));
vi.mock("@/modules/matches/application/reschedule-match", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/modules/matches/application/reschedule-match")>()),
  RescheduleMatch: class {
    execute = mocks.rescheduleMatch;
  },
}));
vi.mock("@/modules/matches/infrastructure/prisma-match-reschedule-repository", () => ({
  PrismaMatchRescheduleRepository: class {},
}));
vi.mock("@/modules/standings/application/recalculate-season", () => ({
  RecalculateSeasonService: class {
    execute = mocks.recalculateSeason;
  },
}));
vi.mock("@/modules/standings/infrastructure/prisma-season-recalculation-repository", () => ({
  PrismaSeasonRecalculationRepository: class {},
}));

import { GET as getAudit } from "@/app/api/v1/admin/audit/route";
import { POST as forgotPassword } from "@/app/api/v1/auth/forgot-password/route";
import { POST as login } from "@/app/api/v1/auth/login/route";
import { POST as logout } from "@/app/api/v1/auth/logout/route";
import { GET as getCurrentUser } from "@/app/api/v1/auth/me/route";
import { POST as register } from "@/app/api/v1/auth/register/route";
import { POST as resetPassword } from "@/app/api/v1/auth/reset-password/route";
import { POST as verifyEmail } from "@/app/api/v1/auth/verify-email/route";
import { GET as getHealth } from "@/app/api/v1/health/route";
import { PUT as savePrediction } from "@/app/api/v1/matches/[matchId]/prediction/route";
import { GET as getOwnPrediction } from "@/app/api/v1/matches/[matchId]/prediction/route";
import { GET as getVisiblePredictions } from "@/app/api/v1/matches/[matchId]/predictions/route";
import { GET as getPublicConfig } from "@/app/api/v1/public/config/route";
import { GET as getPublicTeams } from "@/app/api/v1/public/teams/route";
import { GET as getResults } from "@/app/api/v1/results/route";
import { GET as getStandings } from "@/app/api/v1/standings/route";
import { POST as approveUser } from "@/app/api/v1/admin/users/[userId]/approve/route";
import { POST as processMatchResult } from "@/app/api/v1/admin/matches/[matchId]/process-result/route";
import { POST as rescheduleMatch } from "@/app/api/v1/admin/matches/[matchId]/reschedule/route";
import { POST as recalculateSeason } from "@/app/api/v1/super-admin/seasons/[seasonId]/recalculate/route";

const request = (path: string) => new NextRequest(`https://app.example.invalid${path}`);

describe("API route handlers", () => {
  beforeEach(() => {
    mocks.getApiSession.mockReset();
    mocks.confirmEmail.mockReset();
    mocks.createLoginService.mockReset();
    mocks.createPasswordRecoveryService.mockReset();
    mocks.createRegistrationService.mockReset();
    mocks.consumeRegistrationRateLimit.mockReset();
    mocks.logout.mockReset();
    mocks.getSettings.mockReset();
    mocks.listTeams.mockReset();
    mocks.userFindFirst.mockReset();
    mocks.getClosesAt.mockReset();
    mocks.getOwnPrediction.mockReset();
    mocks.listResults.mockReset();
    mocks.listStandings.mockReset();
    mocks.processMatchResult.mockReset();
    mocks.recalculateSeason.mockReset();
    mocks.revalidatePredictionCaches.mockReset();
    mocks.rescheduleMatch.mockReset();
    mocks.savePrediction.mockReset();
    mocks.auditCount.mockReset();
    mocks.approveUser.mockReset();
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

  it("returns only the authenticated user's prediction", async () => {
    const matchId = "b105eeea-0e6e-4f29-9d95-6c772c47bb7d";
    mocks.getApiSession.mockResolvedValue({ user: { id: "user-id", role: "USER" } });
    mocks.getClosesAt.mockResolvedValue(new Date());
    mocks.getOwnPrediction.mockResolvedValue([{ userId: "user-id", homeGoals: 2, awayGoals: 1 }]);
    const response = await getOwnPrediction(request(`/api/v1/matches/${matchId}/prediction`), {
      params: Promise.resolve({ matchId }),
    });
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { userId: "user-id", homeGoals: 2, awayGoals: 1 },
    });
  });

  it("does not expose other predictions before the closing time", async () => {
    const matchId = "b105eeea-0e6e-4f29-9d95-6c772c47bb7d";
    mocks.getApiSession.mockResolvedValue({ user: { id: "user-id", role: "USER" } });
    mocks.getClosesAt.mockResolvedValue(new Date(Date.now() + 60000));
    const response = await getVisiblePredictions(
      request(`/api/v1/matches/${matchId}/predictions`),
      {
        params: Promise.resolve({ matchId }),
      },
    );
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "PREDICTION_NOT_VISIBLE" },
    });
  });

  it("returns public standings and processed results through their DTO contracts", async () => {
    mocks.listStandings.mockResolvedValue([{ position: 1, nickname: "ana", totalPoints: 3 }]);
    mocks.listResults.mockResolvedValue([{ id: "match-id", officialResult: "2-1", rows: [] }]);
    await expect((await getStandings()).json()).resolves.toEqual({
      success: true,
      data: [{ position: 1, nickname: "ana", totalPoints: 3 }],
    });
    await expect((await getResults()).json()).resolves.toEqual({
      success: true,
      data: [{ id: "match-id", officialResult: "2-1", rows: [] }],
    });
  });

  it("rejects user approval for a non-administrator", async () => {
    mocks.getApiSession.mockResolvedValue({ user: { id: "user-id", role: "USER" } });
    const response = await approveUser(request("/api/v1/admin/users/target/approve"), {
      params: Promise.resolve({ userId: "target" }),
    });
    expect(response.status).toBe(403);
    expect(mocks.approveUser).not.toHaveBeenCalled();
  });

  it("rejects result processing before parsing the body for unauthenticated requests", async () => {
    mocks.getApiSession.mockResolvedValue(null);

    const response = await processMatchResult(
      new NextRequest("https://app.example.invalid/api/v1/admin/matches/match-id/process-result", {
        method: "POST",
        body: "not-json",
      }),
      { params: Promise.resolve({ matchId: "match-id" }) },
    );

    expect(response.status).toBe(401);
    expect(mocks.processMatchResult).not.toHaveBeenCalled();
  });

  it("validates and processes an official match result through the admin contract", async () => {
    const matchId = "b105eeea-0e6e-4f29-9d95-6c772c47bb7d";
    mocks.getApiSession.mockResolvedValue({ user: { id: "admin-id", role: "ADMIN" } });
    mocks.processMatchResult.mockResolvedValue({ status: "PROCESSED" });

    const response = await processMatchResult(
      new NextRequest(
        `https://app.example.invalid/api/v1/admin/matches/${matchId}/process-result`,
        {
          method: "POST",
          body: JSON.stringify({ officialHomeGoals: 2, officialAwayGoals: 1, confirmation: true }),
        },
      ),
      { params: Promise.resolve({ matchId }) },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { matchId, status: "PROCESSED" },
    });
    expect(mocks.processMatchResult).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "admin-id", role: "ADMIN" }),
      { matchId, homeGoals: 2, awayGoals: 1 },
      expect.any(Date),
    );
  });

  it("validates a reschedule date and maps unavailable matches to the HTTP error contract", async () => {
    const matchId = "b105eeea-0e6e-4f29-9d95-6c772c47bb7d";
    mocks.getApiSession.mockResolvedValue({ user: { id: "admin-id", role: "ADMIN" } });
    const invalid = await rescheduleMatch(
      new NextRequest(`https://app.example.invalid/api/v1/admin/matches/${matchId}/reschedule`, {
        method: "POST",
        body: JSON.stringify({ newScheduledAt: "tomorrow" }),
      }),
      { params: Promise.resolve({ matchId }) },
    );
    expect(invalid.status).toBe(400);
    expect(mocks.rescheduleMatch).not.toHaveBeenCalled();

    mocks.rescheduleMatch.mockRejectedValue(new Error("NOT_FOUND"));
    const missing = await rescheduleMatch(
      new NextRequest(`https://app.example.invalid/api/v1/admin/matches/${matchId}/reschedule`, {
        method: "POST",
        body: JSON.stringify({
          newScheduledAt: "2026-08-15T01:00:00.000Z",
          reason: "Cancha no disponible",
        }),
      }),
      { params: Promise.resolve({ matchId }) },
    );
    expect(missing.status).toBe(404);
    await expect(missing.json()).resolves.toMatchObject({ error: { code: "MATCH_NOT_FOUND" } });
  });

  it("restricts season recalculation to super administrators and returns its summary", async () => {
    const seasonId = "b105eeea-0e6e-4f29-9d95-6c772c47bb7d";
    mocks.getApiSession.mockResolvedValue({ user: { id: "admin-id", role: "ADMIN" } });
    const forbidden = await recalculateSeason(
      request(`/api/v1/super-admin/seasons/${seasonId}/recalculate`),
      {
        params: Promise.resolve({ seasonId }),
      },
    );
    expect(forbidden.status).toBe(403);
    expect(mocks.recalculateSeason).not.toHaveBeenCalled();

    mocks.getApiSession.mockResolvedValue({ user: { id: "super-admin-id", role: "SUPER_ADMIN" } });
    mocks.recalculateSeason.mockResolvedValue({ matches: 2, scores: 4, standings: 2 });
    const response = await recalculateSeason(
      request(`/api/v1/super-admin/seasons/${seasonId}/recalculate`),
      {
        params: Promise.resolve({ seasonId }),
      },
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { matches: 2, scores: 4, standings: 2 },
    });
  });

  it("validates and confirms an email verification token through its JSON contract", async () => {
    mocks.confirmEmail.mockResolvedValue("CONFIRMED");

    const response = await verifyEmail(
      new NextRequest("https://app.example.invalid/api/v1/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token: "a".repeat(32) }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: { status: "PENDING_APPROVAL" },
    });
  });

  it("returns 204 for logout without exposing session data", async () => {
    const response = await logout(
      new NextRequest("https://app.example.invalid/api/v1/auth/logout", { method: "POST" }),
    );

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
  });

  it("rejects invalid registration input before consuming the rate-limit bucket", async () => {
    const response = await register(
      new NextRequest("https://app.example.invalid/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email: "not-an-email" }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: { code: "VALIDATION_ERROR" },
    });
    expect(mocks.consumeRegistrationRateLimit).not.toHaveBeenCalled();
  });

  it("returns the registration contract without including a verification token", async () => {
    mocks.consumeRegistrationRateLimit.mockResolvedValue(true);
    mocks.createRegistrationService.mockReturnValue({
      execute: vi.fn().mockResolvedValue({ userId: "user-id", emailSent: true }),
    });
    const body = {
      firstName: "Ana",
      lastName: "Test",
      nickname: "ana_test",
      email: "ana@example.invalid",
      password: "correct-horse-battery",
      passwordConfirmation: "correct-horse-battery",
      favoriteTeamId: "b105eeea-0e6e-4f29-9d95-6c772c47bb7d",
      acceptedRules: true,
    };

    const response = await register(
      new NextRequest("https://app.example.invalid/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: {
        status: "PENDING_EMAIL_CONFIRMATION",
        message: "Revisa tu correo para confirmar tu cuenta.",
        emailSent: true,
      },
    });
  });

  it("sets an HttpOnly session cookie only after a successful login", async () => {
    mocks.createLoginService.mockResolvedValue({
      execute: vi.fn().mockResolvedValue({
        status: "AUTHENTICATED",
        token: "opaque-session-token",
        expiresAt: new Date("2026-08-22T00:00:00.000Z"),
      }),
    });

    const response = await login(
      new NextRequest("https://app.example.invalid/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "ana@example.invalid", password: "correct-horse-battery" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { status: "AUTHENTICATED" },
    });
    expect(response.headers.get("set-cookie")).toMatch(/session=opaque-session-token; Path=\//);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  });

  it("keeps password recovery responses generic", async () => {
    mocks.createPasswordRecoveryService.mockReturnValue({ request: vi.fn().mockResolvedValue({}) });

    const response = await forgotPassword(
      new NextRequest("https://app.example.invalid/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: "unknown@example.invalid" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { message: "Si la cuenta existe, enviaremos instrucciones." },
    });
  });

  it("rejects invalid reset input and maps expired tokens to 410", async () => {
    const invalid = await resetPassword(
      new NextRequest("https://app.example.invalid/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: "bad", password: "short", passwordConfirmation: "short" }),
      }),
    );
    expect(invalid.status).toBe(400);

    mocks.createPasswordRecoveryService.mockReturnValue({
      reset: vi.fn().mockResolvedValue(false),
    });
    const expired = await resetPassword(
      new NextRequest("https://app.example.invalid/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: "a".repeat(32),
          password: "correct-horse-battery",
          passwordConfirmation: "correct-horse-battery",
        }),
      }),
    );
    expect(expired.status).toBe(410);
    await expect(expired.json()).resolves.toMatchObject({
      error: { code: "AUTH_RESET_TOKEN_INVALID" },
    });
  });
});
