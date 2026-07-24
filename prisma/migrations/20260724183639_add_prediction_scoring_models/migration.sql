-- CreateEnum
CREATE TYPE "PredictionScoreType" AS ENUM ('EXACT', 'PARTIAL', 'WRONG', 'NO_PREDICTION');

-- CreateTable
CREATE TABLE "Prediction" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "matchId" UUID NOT NULL,
    "homeGoals" INTEGER NOT NULL,
    "awayGoals" INTEGER NOT NULL,
    "submittedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "lockedAt" TIMESTAMPTZ(6),
    "source" VARCHAR(30),
    "isTestData" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchResult" (
    "id" UUID NOT NULL,
    "matchId" UUID NOT NULL,
    "homeGoals" INTEGER NOT NULL,
    "awayGoals" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "recordedById" UUID NOT NULL,
    "correctionReason" VARCHAR(500),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictionScore" (
    "id" UUID NOT NULL,
    "seasonId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "matchId" UUID NOT NULL,
    "predictionId" UUID,
    "matchResultId" UUID NOT NULL,
    "scoreType" "PredictionScoreType" NOT NULL,
    "basePoints" INTEGER NOT NULL,
    "multiplier" INTEGER NOT NULL,
    "awardedPoints" INTEGER NOT NULL,
    "resultVersion" INTEGER NOT NULL,
    "calculatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculatedById" UUID,

    CONSTRAINT "PredictionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Standing" (
    "id" UUID NOT NULL,
    "seasonId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "previousPosition" INTEGER,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "exactCount" INTEGER NOT NULL DEFAULT 0,
    "partialCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "noPredictionCount" INTEGER NOT NULL DEFAULT 0,
    "matchesScored" INTEGER NOT NULL DEFAULT 0,
    "recalculatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Standing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandingSnapshot" (
    "id" UUID NOT NULL,
    "seasonId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "triggerMatchId" UUID,
    "position" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "exactCount" INTEGER NOT NULL DEFAULT 0,
    "partialCount" INTEGER NOT NULL DEFAULT 0,
    "snapshotVersion" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StandingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prediction_matchId_idx" ON "Prediction"("matchId");

-- CreateIndex
CREATE INDEX "Prediction_submittedAt_idx" ON "Prediction"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_userId_matchId_key" ON "Prediction"("userId", "matchId");

-- CreateIndex
CREATE INDEX "MatchResult_matchId_idx" ON "MatchResult"("matchId");

-- CreateIndex
CREATE INDEX "MatchResult_recordedById_idx" ON "MatchResult"("recordedById");

-- CreateIndex
CREATE UNIQUE INDEX "MatchResult_matchId_version_key" ON "MatchResult"("matchId", "version");

-- CreateIndex
CREATE INDEX "PredictionScore_seasonId_idx" ON "PredictionScore"("seasonId");

-- CreateIndex
CREATE INDEX "PredictionScore_matchId_idx" ON "PredictionScore"("matchId");

-- CreateIndex
CREATE INDEX "PredictionScore_scoreType_idx" ON "PredictionScore"("scoreType");

-- CreateIndex
CREATE INDEX "PredictionScore_predictionId_idx" ON "PredictionScore"("predictionId");

-- CreateIndex
CREATE INDEX "PredictionScore_matchResultId_idx" ON "PredictionScore"("matchResultId");

-- CreateIndex
CREATE UNIQUE INDEX "PredictionScore_userId_matchId_resultVersion_key" ON "PredictionScore"("userId", "matchId", "resultVersion");

-- CreateIndex
CREATE INDEX "Standing_seasonId_position_idx" ON "Standing"("seasonId", "position");

-- CreateIndex
CREATE INDEX "Standing_seasonId_totalPoints_exactCount_idx" ON "Standing"("seasonId", "totalPoints", "exactCount");

-- CreateIndex
CREATE UNIQUE INDEX "Standing_seasonId_userId_key" ON "Standing"("seasonId", "userId");

-- CreateIndex
CREATE INDEX "StandingSnapshot_seasonId_createdAt_idx" ON "StandingSnapshot"("seasonId", "createdAt");

-- CreateIndex
CREATE INDEX "StandingSnapshot_userId_createdAt_idx" ON "StandingSnapshot"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "StandingSnapshot_triggerMatchId_idx" ON "StandingSnapshot"("triggerMatchId");

-- CreateIndex
CREATE UNIQUE INDEX "StandingSnapshot_seasonId_userId_snapshotVersion_key" ON "StandingSnapshot"("seasonId", "userId", "snapshotVersion");

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictionScore" ADD CONSTRAINT "PredictionScore_calculatedById_fkey" FOREIGN KEY ("calculatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictionScore" ADD CONSTRAINT "PredictionScore_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictionScore" ADD CONSTRAINT "PredictionScore_matchResultId_fkey" FOREIGN KEY ("matchResultId") REFERENCES "MatchResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictionScore" ADD CONSTRAINT "PredictionScore_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "Prediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictionScore" ADD CONSTRAINT "PredictionScore_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictionScore" ADD CONSTRAINT "PredictionScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standing" ADD CONSTRAINT "Standing_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standing" ADD CONSTRAINT "Standing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandingSnapshot" ADD CONSTRAINT "StandingSnapshot_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandingSnapshot" ADD CONSTRAINT "StandingSnapshot_triggerMatchId_fkey" FOREIGN KEY ("triggerMatchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandingSnapshot" ADD CONSTRAINT "StandingSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Constraints and partial indexes not representable in the Prisma schema.
ALTER TABLE "Prediction"
  ADD CONSTRAINT "Prediction_homeGoals_nonnegative" CHECK ("homeGoals" >= 0),
  ADD CONSTRAINT "Prediction_awayGoals_nonnegative" CHECK ("awayGoals" >= 0);

ALTER TABLE "MatchResult"
  ADD CONSTRAINT "MatchResult_homeGoals_nonnegative" CHECK ("homeGoals" >= 0),
  ADD CONSTRAINT "MatchResult_awayGoals_nonnegative" CHECK ("awayGoals" >= 0),
  ADD CONSTRAINT "MatchResult_version_minimum" CHECK ("version" >= 1);

ALTER TABLE "PredictionScore"
  ADD CONSTRAINT "PredictionScore_basePoints_nonnegative" CHECK ("basePoints" >= 0),
  ADD CONSTRAINT "PredictionScore_multiplier_minimum" CHECK ("multiplier" >= 1),
  ADD CONSTRAINT "PredictionScore_awardedPoints_consistent" CHECK ("awardedPoints" = "basePoints" * "multiplier"),
  ADD CONSTRAINT "PredictionScore_resultVersion_minimum" CHECK ("resultVersion" >= 1);

ALTER TABLE "Standing"
  ADD CONSTRAINT "Standing_position_positive" CHECK ("position" > 0),
  ADD CONSTRAINT "Standing_counts_nonnegative" CHECK (
    "totalPoints" >= 0
    AND "exactCount" >= 0
    AND "partialCount" >= 0
    AND "wrongCount" >= 0
    AND "noPredictionCount" >= 0
    AND "matchesScored" >= 0
    AND "version" >= 1
  );

ALTER TABLE "StandingSnapshot"
  ADD CONSTRAINT "StandingSnapshot_position_positive" CHECK ("position" > 0),
  ADD CONSTRAINT "StandingSnapshot_counts_nonnegative" CHECK (
    "totalPoints" >= 0
    AND "exactCount" >= 0
    AND "partialCount" >= 0
    AND "snapshotVersion" >= 1
  );

CREATE UNIQUE INDEX "MatchResult_one_current_per_match_key"
ON "MatchResult" ("matchId")
WHERE "isCurrent" = true;
