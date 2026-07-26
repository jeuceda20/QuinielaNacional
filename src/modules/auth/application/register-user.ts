import type { PasswordHasher } from "@/modules/auth/domain/password-hasher";
import type { RegisterInput } from "@/modules/auth/schemas/register-input";
import type { EmailProvider } from "@/modules/email/domain/email-provider";
import type { TeamRepository } from "@/modules/sports/domain/sports-repositories";
import type { UserRepository } from "@/modules/users/domain/user-repository";

export class RegistrationError extends Error {
  public constructor(
    public readonly code: "EMAIL_IN_USE" | "NICKNAME_IN_USE" | "TEAM_UNAVAILABLE",
  ) {
    super(code);
    this.name = "RegistrationError";
  }
}

export type RegisterUserResult = Readonly<{ userId: string; emailSent: false }>;

/** Kept temporarily so existing integrations can construct the service while SMTP is disabled. */
export type EmailVerificationTokenRepository = Readonly<{
  create(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void>;
}>;

export class RegisterUser {
  public constructor(
    private readonly users: UserRepository,
    private readonly teams: TeamRepository,
    private readonly passwordHasher: PasswordHasher,
    _verificationTokens?: EmailVerificationTokenRepository,
    _emailProvider?: EmailProvider,
    _appUrl?: string,
  ) {}

  public async execute(input: RegisterInput, now: Date): Promise<RegisterUserResult> {
    const emailNormalized = input.email.trim().toLowerCase();
    const nickname = input.nickname.trim();
    const nicknameNormalized = nickname.toLowerCase();
    if (await this.users.findByNormalizedEmail(emailNormalized))
      throw new RegistrationError("EMAIL_IN_USE");
    if (await this.users.findByNormalizedNickname(nicknameNormalized))
      throw new RegistrationError("NICKNAME_IN_USE");
    const team = await this.teams.findById(input.favoriteTeamId);
    if (!team || !team.isActive) throw new RegistrationError("TEAM_UNAVAILABLE");

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.users.create({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      nickname,
      nicknameNormalized,
      email: emailNormalized,
      emailNormalized,
      passwordHash,
      favoriteTeamId: team.id,
      status: "PENDING_APPROVAL",
    });
    return { userId: user.id, emailSent: false };
  }
}
