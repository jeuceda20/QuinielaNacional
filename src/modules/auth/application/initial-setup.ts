import { timingSafeEqual } from "node:crypto";
import { z } from "zod";

import type { PasswordHasher } from "@/modules/auth/domain/password-hasher";

export const initialSetupSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  nickname: z.string().trim().min(3).max(50),
  email: z.string().trim().email(),
  password: z.string().min(10).max(128),
  favoriteTeamId: z.string().uuid(),
  setupToken: z.string().min(1),
});
export interface InitialSetupRepository {
  createFirstSuperAdmin(input: {
    firstName: string;
    lastName: string;
    nickname: string;
    nicknameNormalized: string;
    email: string;
    emailNormalized: string;
    passwordHash: string;
    favoriteTeamId: string;
    now: Date;
  }): Promise<"CREATED" | "ALREADY_COMPLETED">;
}
export class InitialSetupError extends Error {
  public constructor(public readonly code: "INVALID_SETUP_TOKEN" | "SETUP_ALREADY_COMPLETED") {
    super(code);
    this.name = "InitialSetupError";
  }
}

export class InitialSetup {
  public constructor(
    private readonly repository: InitialSetupRepository,
    private readonly passwords: PasswordHasher,
    private readonly initialSetupToken: string,
  ) {}
  public async execute(input: z.infer<typeof initialSetupSchema>, now: Date): Promise<void> {
    if (!sameSecret(input.setupToken, this.initialSetupToken))
      throw new InitialSetupError("INVALID_SETUP_TOKEN");
    const passwordHash = await this.passwords.hash(input.password);
    const outcome = await this.repository.createFirstSuperAdmin({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      nickname: input.nickname.trim(),
      nicknameNormalized: input.nickname.trim().toLowerCase(),
      email: input.email.trim().toLowerCase(),
      emailNormalized: input.email.trim().toLowerCase(),
      passwordHash,
      favoriteTeamId: input.favoriteTeamId,
      now,
    });
    if (outcome === "ALREADY_COMPLETED") throw new InitialSetupError("SETUP_ALREADY_COMPLETED");
  }
}

function sameSecret(received: string, expected: string): boolean {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}
