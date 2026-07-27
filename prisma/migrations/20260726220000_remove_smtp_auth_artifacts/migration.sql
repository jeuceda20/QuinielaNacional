DROP TABLE "EmailVerificationToken";
DROP TABLE "PasswordResetToken";

ALTER TABLE "User" DROP COLUMN "emailVerifiedAt";
