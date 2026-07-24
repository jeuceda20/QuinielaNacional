-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('LOGIN', 'LOGOUT', 'USER_REGISTERED', 'USER_APPROVED', 'USER_REJECTED', 'USER_BLOCKED', 'USER_UNBLOCKED', 'USER_DISABLED', 'USER_ROLE_CHANGED', 'SEASON_CREATED', 'SEASON_UPDATED', 'SEASON_ACTIVATED', 'SEASON_CLOSED', 'ROUND_CREATED', 'ROUND_UPDATED', 'ROUND_ARCHIVED', 'MATCH_CREATED', 'MATCH_UPDATED', 'MATCH_RESCHEDULED', 'MATCH_SUSPENDED', 'MATCH_RESUMED', 'MATCH_CANCELLED', 'MATCH_DOUBLE_CHANGED', 'MATCH_PROCESSED', 'MATCH_RESULT_CORRECTED', 'PREDICTION_CREATED', 'PREDICTION_UPDATED', 'SEASON_RECALCULATED', 'SETTINGS_UPDATED', 'MAINTENANCE_ENABLED', 'MAINTENANCE_DISABLED', 'DATA_EXPORTED', 'TEST_DATA_GENERATED', 'SQL_QUERY_EXECUTED', 'INTEGRITY_CHECK_EXECUTED');

-- CreateEnum
CREATE TYPE "AuditEntityType" AS ENUM ('USER', 'TEAM', 'SEASON', 'ROUND', 'MATCH', 'PREDICTION', 'STANDING', 'SPONSOR', 'SETTING', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ACCOUNT_APPROVED', 'ACCOUNT_REJECTED', 'MATCH_CLOSING_SOON', 'PREDICTIONS_PENDING', 'MATCH_RESCHEDULED', 'MATCH_PROCESSED', 'SEASON_STARTED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "OperationalLockType" AS ENUM ('MATCH_PROCESSING', 'SEASON_RECALCULATION', 'IMPORT', 'CRITICAL_OPERATION');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ApplicationSettingKey" AS ENUM ('APPLICATION_NAME', 'APPLICATION_LOGO_PATH', 'APPLICATION_MAINTENANCE_MODE', 'APPLICATION_HOW_IT_WORKS', 'APPLICATION_SOCIAL_LINKS', 'DIAGNOSTICS_ENABLED');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorUserId" UUID,
    "actorRole" "UserRole",
    "action" "AuditAction" NOT NULL,
    "entityType" "AuditEntityType" NOT NULL,
    "entityId" UUID,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "metadataJson" JSONB,
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(500),
    "requestId" VARCHAR(100),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" VARCHAR(1000) NOT NULL,
    "link" VARCHAR(500),
    "dataJson" JSONB,
    "readAt" TIMESTAMPTZ(6),
    "expiresAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "imagePath" VARCHAR(500),
    "targetUrl" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL,
    "startsAt" TIMESTAMPTZ(6),
    "endsAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationSetting" (
    "id" UUID NOT NULL,
    "key" "ApplicationSettingKey" NOT NULL,
    "valueJson" JSONB NOT NULL,
    "description" VARCHAR(500),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ApplicationSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalLock" (
    "id" UUID NOT NULL,
    "lockType" "OperationalLockType" NOT NULL,
    "resourceKey" VARCHAR(200) NOT NULL,
    "acquiredById" UUID,
    "requestId" VARCHAR(100),
    "acquiredAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "releasedAt" TIMESTAMPTZ(6),

    CONSTRAINT "OperationalLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticRun" (
    "id" UUID NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "executedById" UUID,
    "status" "RunStatus" NOT NULL DEFAULT 'PENDING',
    "summaryJson" JSONB,
    "sanitizedError" VARCHAR(1000),
    "requestId" VARCHAR(100),
    "startedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ(6),

    CONSTRAINT "DiagnosticRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportRun" (
    "id" UUID NOT NULL,
    "requestedById" UUID,
    "exportType" VARCHAR(100) NOT NULL,
    "format" VARCHAR(20) NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'PENDING',
    "rowCount" INTEGER,
    "storageKey" VARCHAR(500),
    "expiresAt" TIMESTAMPTZ(6),
    "summaryJson" JSONB,
    "sanitizedError" VARCHAR(1000),
    "requestId" VARCHAR(100),
    "startedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ExportRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_requestId_idx" ON "AuditLog"("requestId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_expiresAt_idx" ON "Notification"("expiresAt");

-- CreateIndex
CREATE INDEX "Sponsor_isActive_idx" ON "Sponsor"("isActive");

-- CreateIndex
CREATE INDEX "Sponsor_displayOrder_idx" ON "Sponsor"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationSetting_key_key" ON "ApplicationSetting"("key");

-- CreateIndex
CREATE INDEX "ApplicationSetting_isPublic_idx" ON "ApplicationSetting"("isPublic");

-- CreateIndex
CREATE INDEX "OperationalLock_expiresAt_idx" ON "OperationalLock"("expiresAt");

-- CreateIndex
CREATE INDEX "OperationalLock_requestId_idx" ON "OperationalLock"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "OperationalLock_lockType_resourceKey_key" ON "OperationalLock"("lockType", "resourceKey");

-- CreateIndex
CREATE INDEX "DiagnosticRun_type_idx" ON "DiagnosticRun"("type");

-- CreateIndex
CREATE INDEX "DiagnosticRun_status_idx" ON "DiagnosticRun"("status");

-- CreateIndex
CREATE INDEX "DiagnosticRun_startedAt_idx" ON "DiagnosticRun"("startedAt");

-- CreateIndex
CREATE INDEX "DiagnosticRun_requestId_idx" ON "DiagnosticRun"("requestId");

-- CreateIndex
CREATE INDEX "ExportRun_requestedById_idx" ON "ExportRun"("requestedById");

-- CreateIndex
CREATE INDEX "ExportRun_status_idx" ON "ExportRun"("status");

-- CreateIndex
CREATE INDEX "ExportRun_expiresAt_idx" ON "ExportRun"("expiresAt");

-- CreateIndex
CREATE INDEX "ExportRun_requestId_idx" ON "ExportRun"("requestId");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationSetting" ADD CONSTRAINT "ApplicationSetting_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationalLock" ADD CONSTRAINT "OperationalLock_acquiredById_fkey" FOREIGN KEY ("acquiredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticRun" ADD CONSTRAINT "DiagnosticRun_executedById_fkey" FOREIGN KEY ("executedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportRun" ADD CONSTRAINT "ExportRun_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Constraints not representable in the Prisma schema.
ALTER TABLE "Sponsor"
  ADD CONSTRAINT "Sponsor_displayOrder_nonnegative" CHECK ("displayOrder" >= 0),
  ADD CONSTRAINT "Sponsor_date_range_valid" CHECK ("endsAt" IS NULL OR "startsAt" IS NULL OR "endsAt" >= "startsAt");

ALTER TABLE "OperationalLock"
  ADD CONSTRAINT "OperationalLock_expiration_after_acquisition" CHECK ("expiresAt" > "acquiredAt"),
  ADD CONSTRAINT "OperationalLock_release_after_acquisition" CHECK ("releasedAt" IS NULL OR "releasedAt" >= "acquiredAt");

ALTER TABLE "DiagnosticRun"
  ADD CONSTRAINT "DiagnosticRun_completion_after_start" CHECK ("completedAt" IS NULL OR "completedAt" >= "startedAt");

ALTER TABLE "ExportRun"
  ADD CONSTRAINT "ExportRun_rowCount_nonnegative" CHECK ("rowCount" IS NULL OR "rowCount" >= 0),
  ADD CONSTRAINT "ExportRun_completion_after_start" CHECK ("completedAt" IS NULL OR "completedAt" >= "startedAt");
