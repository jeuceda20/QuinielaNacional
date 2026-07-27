export type SystemStatus = Readonly<{
  application: "UP";
  database: "UP" | "DOWN";
  version: string;
  environment: string;
  diagnosticsEnabled: boolean;
}>;
export interface SystemStatusRepository {
  checkDatabase(): Promise<boolean>;
}
export class GetSystemStatus {
  public constructor(
    private readonly repository: SystemStatusRepository,
    private readonly config: {
      version: string;
      environment: string;
      diagnosticsEnabled: boolean;
    },
  ) {}
  async execute(): Promise<SystemStatus> {
    return {
      application: "UP",
      database: (await this.repository.checkDatabase()) ? "UP" : "DOWN",
      version: this.config.version,
      environment: this.config.environment,
      diagnosticsEnabled: this.config.diagnosticsEnabled,
    };
  }
}
