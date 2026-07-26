ALTER TABLE "Standing"
  ADD COLUMN "doublePoints" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "doubleExactCount" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "Standing_seasonId_totalPoints_exactCount_doubleExactCount_idx"
  ON "Standing"("seasonId", "totalPoints", "exactCount", "doubleExactCount");

WITH double_totals AS (
  SELECT
    score."seasonId",
    score."userId",
    COALESCE(SUM(score."awardedPoints"), 0)::int AS "doublePoints",
    COUNT(*) FILTER (WHERE score."scoreType" = 'EXACT')::int AS "doubleExactCount"
  FROM "PredictionScore" score
  INNER JOIN "Match" match ON match.id = score."matchId" AND match."isDoublePoints" = true
  GROUP BY score."seasonId", score."userId"
)
UPDATE "Standing" standing
SET
  "doublePoints" = COALESCE(double_totals."doublePoints", 0),
  "doubleExactCount" = COALESCE(double_totals."doubleExactCount", 0)
FROM double_totals
WHERE standing."seasonId" = double_totals."seasonId"
  AND standing."userId" = double_totals."userId";

WITH ranked AS (
  SELECT
    id,
    RANK() OVER (
      PARTITION BY "seasonId"
      ORDER BY "totalPoints" DESC, "exactCount" DESC, "doubleExactCount" DESC
    )::int AS position
  FROM "Standing"
)
UPDATE "Standing" standing
SET position = ranked.position
FROM ranked
WHERE standing.id = ranked.id;
