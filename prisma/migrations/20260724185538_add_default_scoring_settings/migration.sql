-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ApplicationSettingKey" ADD VALUE 'DEFAULT_EXACT_POINTS';
ALTER TYPE "ApplicationSettingKey" ADD VALUE 'DEFAULT_PARTIAL_POINTS';
ALTER TYPE "ApplicationSettingKey" ADD VALUE 'DEFAULT_WRONG_POINTS';
ALTER TYPE "ApplicationSettingKey" ADD VALUE 'DEFAULT_DOUBLE_MULTIPLIER';
ALTER TYPE "ApplicationSettingKey" ADD VALUE 'DEFAULT_PREDICTION_CLOSE_MINUTES';
ALTER TYPE "ApplicationSettingKey" ADD VALUE 'DEFAULT_MAX_PREDICTION_GOALS';
