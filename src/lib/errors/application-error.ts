import { ErrorCode } from "@/lib/errors/error-code";

export type FieldErrors = Record<string, string[]>;

type ApplicationErrorOptions = {
  code: ErrorCode;
  message: string;
  fieldErrors?: FieldErrors;
  details?: unknown;
};

export class ApplicationError extends Error {
  readonly code: ErrorCode;
  readonly fieldErrors?: FieldErrors;
  readonly details?: unknown;

  constructor({ code, message, fieldErrors, details }: ApplicationErrorOptions) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.details = details;
  }
}
