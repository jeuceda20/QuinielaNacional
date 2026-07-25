export type DoubleActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export type DoubleResult = "SET" | "NOT_FOUND" | "CONFLICT" | "CLOSED";
export interface DoubleMatchRepository {
  set(matchId: string, actorId: string, now: Date): Promise<DoubleResult>;
}
export class SetDoubleMatch {
  public constructor(private readonly matches: DoubleMatchRepository) {}
  async execute(a: DoubleActor, id: string, n: Date) {
    if (a.status !== "APPROVED" || (a.role !== "ADMIN" && a.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
    const r = await this.matches.set(id, a.id, n);
    if (r !== "SET") throw new Error(r);
  }
}
