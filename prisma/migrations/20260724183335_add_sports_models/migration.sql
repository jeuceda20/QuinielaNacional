-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'RESCHEDULED', 'CLOSED', 'SUSPENDED', 'RESUMED', 'FINISHED_PENDING', 'PROCESSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Team" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "shortName" VARCHAR(30) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "logoPath" VARCHAR(500),
    "displayOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "status" "SeasonStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMPTZ(6),
    "endsAt" TIMESTAMPTZ(6),
    "closedAt" TIMESTAMPTZ(6),
    "closedById" UUID,
    "exactPoints" INTEGER NOT NULL DEFAULT 3,
    "partialPoints" INTEGER NOT NULL DEFAULT 1,
    "wrongPoints" INTEGER NOT NULL DEFAULT 0,
    "doubleMultiplier" INTEGER NOT NULL DEFAULT 2,
    "predictionCloseMinutes" INTEGER NOT NULL DEFAULT 5,
    "maxPredictionGoals" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "archivedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonParticipant" (
    "id" UUID NOT NULL,
    "seasonId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isEligible" BOOLEAN NOT NULL DEFAULT true,
    "excludedAt" TIMESTAMPTZ(6),
    "excludedById" UUID,
    "exclusionReason" VARCHAR(500),
    "isTestData" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SeasonParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" UUID NOT NULL,
    "seasonId" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "sequence" INTEGER,
    "status" "RoundStatus" NOT NULL DEFAULT 'DRAFT',
    "description" VARCHAR(500),
    "publishedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "archivedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" UUID NOT NULL,
    "seasonId" UUID NOT NULL,
    "roundId" UUID NOT NULL,
    "homeTeamId" UUID NOT NULL,
    "awayTeamId" UUID NOT NULL,
    "scheduledAt" TIMESTAMPTZ(6) NOT NULL,
    "originalScheduledAt" TIMESTAMPTZ(6),
    "predictionClosesAt" TIMESTAMPTZ(6) NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "isDoublePoints" BOOLEAN NOT NULL DEFAULT false,
    "venue" VARCHAR(200),
    "notes" TEXT,
    "officialHomeGoals" INTEGER,
    "officialAwayGoals" INTEGER,
    "processedAt" TIMESTAMPTZ(6),
    "processedById" UUID,
    "resultVersion" INTEGER NOT NULL DEFAULT 1,
    "processingStartedAt" TIMESTAMPTZ(6),
    "processingStartedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "archivedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchScheduleHistory" (
    "id" UUID NOT NULL,
    "matchId" UUID NOT NULL,
    "previousScheduledAt" TIMESTAMPTZ(6) NOT NULL,
    "newScheduledAt" TIMESTAMPTZ(6) NOT NULL,
    "previousClosesAt" TIMESTAMPTZ(6) NOT NULL,
    "newClosesAt" TIMESTAMPTZ(6) NOT NULL,
    "reason" VARCHAR(500),
    "changedById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchScheduleHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");

-- CreateIndex
CREATE INDEX "Team_isActive_idx" ON "Team"("isActive");

-- CreateIndex
CREATE INDEX "Team_displayOrder_idx" ON "Team"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Season_name_key" ON "Season"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Season_slug_key" ON "Season"("slug");

-- CreateIndex
CREATE INDEX "Season_status_idx" ON "Season"("status");

-- CreateIndex
CREATE INDEX "SeasonParticipant_userId_idx" ON "SeasonParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SeasonParticipant_seasonId_userId_key" ON "SeasonParticipant"("seasonId", "userId");

-- CreateIndex
CREATE INDEX "Round_seasonId_idx" ON "Round"("seasonId");

-- CreateIndex
CREATE INDEX "Round_status_idx" ON "Round"("status");

-- CreateIndex
CREATE INDEX "Round_sequence_idx" ON "Round"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "Round_seasonId_slug_key" ON "Round"("seasonId", "slug");

-- CreateIndex
CREATE INDEX "Match_seasonId_idx" ON "Match"("seasonId");

-- CreateIndex
CREATE INDEX "Match_roundId_idx" ON "Match"("roundId");

-- CreateIndex
CREATE INDEX "Match_scheduledAt_idx" ON "Match"("scheduledAt");

-- CreateIndex
CREATE INDEX "Match_predictionClosesAt_idx" ON "Match"("predictionClosesAt");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "Match_homeTeamId_idx" ON "Match"("homeTeamId");

-- CreateIndex
CREATE INDEX "Match_awayTeamId_idx" ON "Match"("awayTeamId");

-- CreateIndex
CREATE INDEX "Match_processedAt_idx" ON "Match"("processedAt");

-- CreateIndex
CREATE INDEX "MatchScheduleHistory_matchId_idx" ON "MatchScheduleHistory"("matchId");

-- CreateIndex
CREATE INDEX "MatchScheduleHistory_changedById_idx" ON "MatchScheduleHistory"("changedById");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteTeamId_fkey" FOREIGN KEY ("favoriteTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonParticipant" ADD CONSTRAINT "SeasonParticipant_excludedById_fkey" FOREIGN KEY ("excludedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonParticipant" ADD CONSTRAINT "SeasonParticipant_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonParticipant" ADD CONSTRAINT "SeasonParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_processingStartedById_fkey" FOREIGN KEY ("processingStartedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchScheduleHistory" ADD CONSTRAINT "MatchScheduleHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchScheduleHistory" ADD CONSTRAINT "MatchScheduleHistory_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Constraints and partial indexes not representable in the Prisma schema.
ALTER TABLE "Team" ADD CONSTRAINT "Team_displayOrder_nonnegative" CHECK ("displayOrder" >= 0);

ALTER TABLE "Season"
  ADD CONSTRAINT "Season_points_nonnegative" CHECK (
    "exactPoints" >= 0
    AND "partialPoints" >= 0
    AND "wrongPoints" >= 0
    AND "predictionCloseMinutes" >= 0
    AND "maxPredictionGoals" >= 0
  ),
  ADD CONSTRAINT "Season_doubleMultiplier_minimum" CHECK ("doubleMultiplier" >= 1);

ALTER TABLE "Match"
  ADD CONSTRAINT "Match_different_teams" CHECK ("homeTeamId" <> "awayTeamId"),
  ADD CONSTRAINT "Match_officialHomeGoals_nonnegative" CHECK ("officialHomeGoals" IS NULL OR "officialHomeGoals" >= 0),
  ADD CONSTRAINT "Match_officialAwayGoals_nonnegative" CHECK ("officialAwayGoals" IS NULL OR "officialAwayGoals" >= 0),
  ADD CONSTRAINT "Match_resultVersion_minimum" CHECK ("resultVersion" >= 1);

CREATE UNIQUE INDEX "Season_one_active_key"
ON "Season" ("status")
WHERE "status" = 'ACTIVE';

CREATE UNIQUE INDEX "Match_one_double_per_round_key"
ON "Match" ("roundId")
WHERE "isDoublePoints" = true
  AND "archivedAt" IS NULL
  AND "status" <> 'CANCELLED';
