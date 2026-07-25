/**
 * Returns only the public host declared for the application. Next.js compares
 * this value with the Origin header for Server Actions before executing them.
 */
export function getAllowedServerActionOrigins(appUrl: string | undefined): string[] {
  if (!appUrl) return [];

  try {
    const url = new URL(appUrl);

    return url.protocol === "http:" || url.protocol === "https:" ? [url.host] : [];
  } catch {
    return [];
  }
}
