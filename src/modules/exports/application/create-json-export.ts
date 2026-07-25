import { createHash } from "node:crypto";

export const JSON_EXPORT_FORMAT = "quiniela-nacional-export";
export const JSON_EXPORT_VERSION = 1;

export type JsonExportData = Readonly<Record<string, readonly unknown[]>>;
export type JsonExportArtifact = Readonly<{
  content: string;
  checksum: string;
  rowCount: number;
  format: typeof JSON_EXPORT_FORMAT;
  version: typeof JSON_EXPORT_VERSION;
}>;

export interface JsonExportSource {
  read(): Promise<JsonExportData>;
}
export interface JsonExportRunRepository {
  start(actorUserId: string | null, requestId: string | null, startedAt: Date): Promise<string>;
  succeed(id: string, artifact: JsonExportArtifact, completedAt: Date): Promise<void>;
  fail(id: string, completedAt: Date): Promise<void>;
  audit(
    actorUserId: string | null,
    requestId: string | null,
    artifact: JsonExportArtifact,
  ): Promise<void>;
}

export function createJsonExportArtifact(
  data: JsonExportData,
  generatedAt: Date,
): JsonExportArtifact {
  const content = JSON.stringify({
    format: JSON_EXPORT_FORMAT,
    version: JSON_EXPORT_VERSION,
    generatedAt: generatedAt.toISOString(),
    data,
  });
  return {
    content,
    checksum: createHash("sha256").update(content).digest("hex"),
    rowCount: Object.values(data).reduce((total, rows) => total + rows.length, 0),
    format: JSON_EXPORT_FORMAT,
    version: JSON_EXPORT_VERSION,
  };
}

export class CreateJsonExport {
  public constructor(
    private readonly source: JsonExportSource,
    private readonly runs: JsonExportRunRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}
  async execute(actorUserId: string | null, requestId: string | null): Promise<JsonExportArtifact> {
    const runId = await this.runs.start(actorUserId, requestId, this.now());
    try {
      const artifact = createJsonExportArtifact(await this.source.read(), this.now());
      await this.runs.succeed(runId, artifact, this.now());
      await this.runs.audit(actorUserId, requestId, artifact);
      return artifact;
    } catch (error) {
      await this.runs.fail(runId, this.now());
      throw error;
    }
  }
}
