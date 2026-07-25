export type SystemStatus = Readonly<{
  application: "UP";
  database: "UP" | "DOWN";
  smtpConfigured: boolean;
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
      smtpConfigured: boolean;
      diagnosticsEnabled: boolean;
    },
  ) {}
  async execute(): Promise<SystemStatus> {
    return {
      application: "UP",
      database: (await this.repository.checkDatabase()) ? "UP" : "DOWN",
      smtpConfigured: this.config.smtpConfigured,
      version: this.config.version,
      environment: this.config.environment,
      diagnosticsEnabled: this.config.diagnosticsEnabled,
    };
  }
}
