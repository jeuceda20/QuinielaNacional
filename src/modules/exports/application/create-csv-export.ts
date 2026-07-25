import { createHash } from "node:crypto";

export type CsvRow = Readonly<Record<string, unknown>>;
export type CsvExportArtifact = Readonly<{
  content: string;
  checksum: string;
  rowCount: number;
  columns: readonly string[];
}>;

export function createCsvExportArtifact(rows: readonly CsvRow[]): CsvExportArtifact {
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))].sort();
  const content = [
    columns.map(escapeCsvCell).join(","),
    ...rows.map((row) => columns.map((column) => escapeCsvCell(row[column])).join(",")),
  ].join("\r\n");
  return {
    content,
    checksum: createHash("sha256").update(content).digest("hex"),
    rowCount: rows.length,
    columns,
  };
}

export function escapeCsvCell(value: unknown): string {
  const normalized = toText(value);
  const safe = /^[=+\-@]/.test(normalized) ? `'${normalized}` : normalized;
  return `"${safe.replaceAll('"', '""')}"`;
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
