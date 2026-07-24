import { createRequestId } from "@/lib/request-id";

export type RequestContextRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export type RequestContext = Readonly<{
  requestId: string;
  userId: string | null;
  role: RequestContextRole | null;
  ipAddress: string | null;
  userAgent: string | null;
}>;

export type CreateRequestContextInput = Readonly<{
  requestId?: string;
  userId?: string | null;
  role?: RequestContextRole | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}>;

export function createRequestContext(input: CreateRequestContextInput = {}): RequestContext {
  return Object.freeze({
    requestId: input.requestId ?? createRequestId(),
    userId: input.userId ?? null,
    role: input.role ?? null,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  });
}
