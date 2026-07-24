import type { SessionService } from "@/modules/auth/application/session-service";

export interface SessionCookieStore {
  clear(): Promise<void>;
}

export class LogoutUser {
  public constructor(
    private readonly sessions: SessionService,
    private readonly cookies: SessionCookieStore,
  ) {}

  public async execute(sessionToken: string | null, now: Date): Promise<void> {
    if (sessionToken) await this.sessions.revoke(sessionToken, now);
    await this.cookies.clear();
  }
}
