import type {
  MatchEntity,
  MatchRepository,
  RoundEntity,
  RoundRepository,
  SeasonEntity,
  SeasonRepository,
  TeamEntity,
  TeamRepository,
} from "@/modules/sports/domain/sports-repositories";

import { prisma } from "@/lib/prisma";

import type { Match, PrismaClient, Round, Season, Team } from "@/generated/prisma/client";

export type SportsRepositoryDatabase = Pick<PrismaClient, "match" | "round" | "season" | "team">;

const toTeamEntity = (team: Team): TeamEntity => ({
  id: team.id,
  name: team.name,
  shortName: team.shortName,
  slug: team.slug,
  logoPath: team.logoPath,
  displayOrder: team.displayOrder,
  isActive: team.isActive,
});

const toSeasonEntity = (season: Season): SeasonEntity => ({
  id: season.id,
  name: season.name,
  slug: season.slug,
  status: season.status,
  predictionCloseMinutes: season.predictionCloseMinutes,
});

const toRoundEntity = (round: Round): RoundEntity => ({
  id: round.id,
  seasonId: round.seasonId,
  name: round.name,
  slug: round.slug,
  sequence: round.sequence,
  status: round.status,
});

const toMatchEntity = (match: Match): MatchEntity => ({
  id: match.id,
  seasonId: match.seasonId,
  roundId: match.roundId,
  homeTeamId: match.homeTeamId,
  awayTeamId: match.awayTeamId,
  scheduledAt: match.scheduledAt,
  predictionClosesAt: match.predictionClosesAt,
  status: match.status,
  isDoublePoints: match.isDoublePoints,
});

export class PrismaTeamRepository implements TeamRepository {
  public constructor(private readonly database: SportsRepositoryDatabase = prisma) {}

  public async findById(id: string): Promise<TeamEntity | null> {
    const team = await this.database.team.findFirst({ where: { id, deletedAt: null } });
    return team ? toTeamEntity(team) : null;
  }

  public async listActive(): Promise<readonly TeamEntity[]> {
    const teams = await this.database.team.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
    return teams.map(toTeamEntity);
  }
}

export class PrismaSeasonRepository implements SeasonRepository {
  public constructor(private readonly database: SportsRepositoryDatabase = prisma) {}

  public async findById(id: string): Promise<SeasonEntity | null> {
    const season = await this.database.season.findFirst({ where: { id, archivedAt: null } });
    return season ? toSeasonEntity(season) : null;
  }

  public async findActive(): Promise<SeasonEntity | null> {
    const season = await this.database.season.findFirst({
      where: { status: "ACTIVE", archivedAt: null },
    });
    return season ? toSeasonEntity(season) : null;
  }
}

export class PrismaRoundRepository implements RoundRepository {
  public constructor(private readonly database: SportsRepositoryDatabase = prisma) {}

  public async findById(id: string): Promise<RoundEntity | null> {
    const round = await this.database.round.findFirst({ where: { id, archivedAt: null } });
    return round ? toRoundEntity(round) : null;
  }

  public async listBySeason(seasonId: string): Promise<readonly RoundEntity[]> {
    const rounds = await this.database.round.findMany({
      where: { seasonId, archivedAt: null },
      orderBy: [{ sequence: "asc" }, { createdAt: "asc" }],
    });
    return rounds.map(toRoundEntity);
  }
}

export class PrismaMatchRepository implements MatchRepository {
  public constructor(private readonly database: SportsRepositoryDatabase = prisma) {}

  public async findById(id: string): Promise<MatchEntity | null> {
    const match = await this.database.match.findFirst({ where: { id, archivedAt: null } });
    return match ? toMatchEntity(match) : null;
  }

  public async listByRound(roundId: string): Promise<readonly MatchEntity[]> {
    const matches = await this.database.match.findMany({
      where: { roundId, archivedAt: null },
      orderBy: { scheduledAt: "asc" },
    });
    return matches.map(toMatchEntity);
  }
}
