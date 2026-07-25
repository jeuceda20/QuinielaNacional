import { NextResponse } from "next/server";

import { createRequestId } from "@/lib/request-id";

type ApiErrorOptions = Readonly<{
  fieldErrors?: Record<string, string[]>;
  requestId?: string;
}>;

export function apiSuccess<T>(data: T, status = 200, meta?: Record<string, unknown>) {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) }, { status });
}

export function apiError(
  status: number,
  code: string,
  message: string,
  options: ApiErrorOptions = {},
) {
  const requestId = options.requestId ?? createRequestId();
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(options.fieldErrors ? { fieldErrors: options.fieldErrors } : {}),
      },
      requestId,
    },
    { status, headers: { "x-request-id": requestId } },
  );
}
