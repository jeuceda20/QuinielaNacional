import { ApplicationError, type FieldErrors } from "@/lib/errors/application-error";
import { ErrorCode } from "@/lib/errors/error-code";
import { createRequestId } from "@/lib/request-id";

type ErrorBody = {
  code: ErrorCode;
  message: string;
  fieldErrors?: FieldErrors;
};

export type ErrorResponse = {
  success: false;
  error: ErrorBody;
  requestId: string;
};

export type SerializedError = {
  response: ErrorResponse;
  statusCode: number;
};

const errorStatusCodes: Partial<Record<ErrorCode, number>> = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 401,
  [ErrorCode.AUTH_EMAIL_NOT_VERIFIED]: 403,
  [ErrorCode.AUTH_ACCOUNT_PENDING_APPROVAL]: 403,
  [ErrorCode.AUTH_ACCOUNT_REJECTED]: 403,
  [ErrorCode.AUTH_ACCOUNT_BLOCKED]: 403,
  [ErrorCode.AUTH_ACCOUNT_DISABLED]: 403,
  [ErrorCode.AUTH_SESSION_EXPIRED]: 401,
  [ErrorCode.AUTH_SESSION_REVOKED]: 401,
  [ErrorCode.AUTH_RATE_LIMITED]: 429,
  [ErrorCode.USER_NOT_FOUND]: 404,
  [ErrorCode.USER_EMAIL_ALREADY_EXISTS]: 409,
  [ErrorCode.USER_NICKNAME_ALREADY_EXISTS]: 409,
  [ErrorCode.USER_EMAIL_IMMUTABLE]: 409,
  [ErrorCode.USER_ALREADY_APPROVED]: 409,
  [ErrorCode.USER_INVALID_STATUS_TRANSITION]: 409,
  [ErrorCode.MATCH_NOT_FOUND]: 404,
  [ErrorCode.MATCH_INVALID_TEAMS]: 422,
  [ErrorCode.MATCH_DUPLICATE_WARNING]: 409,
  [ErrorCode.MATCH_ALREADY_PROCESSED]: 409,
  [ErrorCode.MATCH_NOT_PROCESSABLE]: 409,
  [ErrorCode.MATCH_CANCELLED]: 409,
  [ErrorCode.MATCH_SUSPENDED]: 409,
  [ErrorCode.MATCH_PROCESSING_CONFLICT]: 409,
  [ErrorCode.MATCH_DOUBLE_CONFLICT]: 409,
  [ErrorCode.PREDICTION_NOT_FOUND]: 404,
  [ErrorCode.PREDICTION_CLOSED]: 409,
  [ErrorCode.PREDICTION_INVALID_SCORE]: 422,
  [ErrorCode.PREDICTION_ALREADY_LOCKED]: 409,
  [ErrorCode.PREDICTION_NOT_VISIBLE]: 403,
  [ErrorCode.SEASON_NOT_FOUND]: 404,
  [ErrorCode.SEASON_ALREADY_ACTIVE]: 409,
  [ErrorCode.SEASON_NOT_ACTIVE]: 409,
  [ErrorCode.SEASON_CLOSE_BLOCKED]: 409,
  [ErrorCode.SEASON_RECALCULATION_IN_PROGRESS]: 409,
  [ErrorCode.DIAGNOSTICS_DISABLED]: 403,
  [ErrorCode.SQL_CONSOLE_DISABLED]: 403,
  [ErrorCode.SQL_QUERY_NOT_ALLOWED]: 403,
  [ErrorCode.SQL_QUERY_TIMEOUT]: 503,
  [ErrorCode.TEST_DATA_TOOLS_DISABLED]: 403,
  [ErrorCode.VALIDATION_ERROR]: 422,
  [ErrorCode.DATABASE_OPERATION_FAILED]: 503,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,
};

const internalErrorMessage = "Ocurrió un error inesperado. Inténtalo de nuevo.";

export function serializeError(
  error: unknown,
  requestId: string = createRequestId(),
): SerializedError {
  if (error instanceof ApplicationError) {
    return {
      response: {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.fieldErrors === undefined ? {} : { fieldErrors: error.fieldErrors }),
        },
        requestId,
      },
      statusCode: errorStatusCodes[error.code] ?? 500,
    };
  }

  return {
    response: {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: internalErrorMessage,
      },
      requestId,
    },
    statusCode: 500,
  };
}
