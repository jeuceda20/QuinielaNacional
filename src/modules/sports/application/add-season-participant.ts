export type ParticipantActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export type ParticipantResult = "ADDED" | "DUPLICATE" | "SEASON_NOT_ACTIVE" | "USER_NOT_ELIGIBLE";
export interface SeasonParticipantRepository {
  add(
    seasonId: string,
    userId: string,
    actorId: string,
    now: Date,
    requestId?: string | null,
  ): Promise<ParticipantResult>;
}
export class AddSeasonParticipant {
  public constructor(private readonly participants: SeasonParticipantRepository) {}
  async execute(
    actor: ParticipantActor,
    seasonId: string,
    userId: string,
    now: Date,
    requestId?: string | null,
  ) {
    if (actor.status !== "APPROVED" || (actor.role !== "ADMIN" && actor.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
    const result = await this.participants.add(seasonId, userId, actor.id, now, requestId);
    if (result !== "ADDED") throw new Error(result);
  }
}
