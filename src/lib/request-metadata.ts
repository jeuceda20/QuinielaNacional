import { headers } from "next/headers";

export async function getRequestIpAddress(): Promise<string | null> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwarded || requestHeaders.get("x-real-ip") || null;
}
