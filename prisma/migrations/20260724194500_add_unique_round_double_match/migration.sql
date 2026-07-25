CREATE UNIQUE INDEX "Match_one_double_per_round" ON "Match" ("roundId") WHERE "isDoublePoints" = true AND "archivedAt" IS NULL;
