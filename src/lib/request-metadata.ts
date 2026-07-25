import { headers } from "next/headers";

export function getIpAddressFromHeaders(requestHeaders: Headers): string | null {
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || requestHeaders.get("x-real-ip") || null;
}

export async function getRequestIpAddress(): Promise<string | null> {
  return getIpAddressFromHeaders(await headers());
}
