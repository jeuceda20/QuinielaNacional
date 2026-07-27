import { LoginUser } from "@/modules/auth/application/login-user";
import { RegisterUser } from "@/modules/auth/application/register-user";
import { SessionService } from "@/modules/auth/application/session-service";
import { Argon2PasswordHasher } from "@/modules/auth/infrastructure/argon2-password-hasher";
import { PrismaSessionRepository } from "@/modules/auth/infrastructure/prisma-session-repository";
import { RateLimiter, rateLimitRules } from "@/modules/security/application/rate-limiter";
import { PrismaRateLimitRepository } from "@/modules/security/infrastructure/prisma-rate-limit-repository";
import { PrismaTeamRepository } from "@/modules/sports/infrastructure/prisma-sports-repositories";
import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma-user-repository";


export function createRegistrationService() {
  return new RegisterUser(
    new PrismaUserRepository(),
    new PrismaTeamRepository(),
    new Argon2PasswordHasher(),
  );
}

export function consumeRegistrationRateLimit(ipAddress: string | null, now: Date) {
  return new RateLimiter(new PrismaRateLimitRepository()).consume(
    "registration:ip",
    ipAddress,
    rateLimitRules.registrationByIp,
    now,
  );
}

export async function createLoginService() {
  const passwords = new Argon2PasswordHasher();
  const limiter = new RateLimiter(new PrismaRateLimitRepository());
  return new LoginUser(
    new PrismaUserRepository(),
    passwords,
    new SessionService(new PrismaSessionRepository()),
    {
      consume: async (ipAddress, email, now) =>
        (await limiter.consume("login:ip", ipAddress, rateLimitRules.loginByIp, now)) &&
        limiter.consume("login:email", email, rateLimitRules.loginByEmail, now),
    },
    await passwords.hash("timing-placeholder-password"),
  );
}
