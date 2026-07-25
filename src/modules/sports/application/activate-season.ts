export type SeasonActivationActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export type SeasonActivationResult =
  | "ACTIVATED"
  | "ALREADY_ACTIVE"
  | "NOT_FOUND"
  | "INVALID_STATE"
  | "ACTIVE_SEASON_ALREADY_EXISTS"
  | "INSUFFICIENT_ACTIVE_TEAMS";
export interface SeasonActivationRepository {
  activate(
    seasonId: string,
    actorId: string,
    now: Date,
    requestId?: string | null,
  ): Promise<SeasonActivationResult>;
}
export class ActivateSeason {
  public constructor(private readonly seasons: SeasonActivationRepository) {}
  async execute(
    actor: SeasonActivationActor,
    seasonId: string,
    now: Date,
    requestId?: string | null,
  ) {
    if (actor.status !== "APPROVED" || (actor.role !== "ADMIN" && actor.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
    const result = await this.seasons.activate(seasonId, actor.id, now, requestId);
    if (result !== "ACTIVATED" && result !== "ALREADY_ACTIVE") throw new Error(result);
    return { alreadyActive: result === "ALREADY_ACTIVE" };
  }
}
