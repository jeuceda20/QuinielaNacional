import { createHash } from "node:crypto";

export type EmailConfirmationOutcome = "CONFIRMED" | "ALREADY_CONFIRMED" | "INVALID";

export interface EmailConfirmationRepository {
  confirm(tokenHash: string, now: Date): Promise<EmailConfirmationOutcome>;
}

export class InvalidEmailConfirmationTokenError extends Error {
  public constructor() {
    super("El enlace no es válido o ha expirado.");
    this.name = "InvalidEmailConfirmationTokenError";
  }
}

export class ConfirmEmail {
  public constructor(private readonly repository: EmailConfirmationRepository) {}

  public async execute(
    token: string,
    now: Date,
  ): Promise<Exclude<EmailConfirmationOutcome, "INVALID">> {
    if (!/^[A-Za-z0-9_-]{32,}$/.test(token)) throw new InvalidEmailConfirmationTokenError();
    const outcome = await this.repository.confirm(
      createHash("sha256").update(token).digest("hex"),
      now,
    );
    if (outcome === "INVALID") throw new InvalidEmailConfirmationTokenError();
    return outcome;
  }
}
