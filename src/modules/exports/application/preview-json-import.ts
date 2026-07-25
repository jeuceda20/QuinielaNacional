import {
  JSON_EXPORT_FORMAT,
  JSON_EXPORT_VERSION,
  type JsonExportData,
} from "@/modules/exports/application/create-json-export";

export type ImportPreview = Readonly<{
  valid: boolean;
  counts: Readonly<Record<string, number>>;
  errors: readonly string[];
}>;

export function previewJsonImport(content: string): ImportPreview {
  try {
    const parsed = JSON.parse(content) as { format?: unknown; version?: unknown; data?: unknown };
    const errors: string[] = [];
    if (parsed.format !== JSON_EXPORT_FORMAT) errors.push("Formato de exportacion no reconocido.");
    if (parsed.version !== JSON_EXPORT_VERSION)
      errors.push("Version de exportacion no compatible.");
    if (!parsed.data || typeof parsed.data !== "object" || Array.isArray(parsed.data))
      errors.push("El bloque de datos es invalido.");
    const data = (
      parsed.data && typeof parsed.data === "object" && !Array.isArray(parsed.data)
        ? parsed.data
        : {}
    ) as JsonExportData;
    const counts = Object.fromEntries(
      Object.entries(data).map(([name, rows]) => [name, Array.isArray(rows) ? rows.length : 0]),
    );
    for (const [name, rows] of Object.entries(data))
      if (!Array.isArray(rows)) errors.push(`La coleccion ${name} debe ser una lista.`);
    return { valid: errors.length === 0, counts, errors };
  } catch {
    return { valid: false, counts: {}, errors: ["El archivo no contiene JSON valido."] };
  }
}
