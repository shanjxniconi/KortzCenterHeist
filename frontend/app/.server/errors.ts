import { ApiError } from 'lib/types';

export class ServerError extends Error {

  httpStatus: number | null;
  code: string | null;

  constructor(httpStatus: number, error: ApiError) {
    super(error ? `${error.code || ""}` || undefined : undefined);
    this.httpStatus = httpStatus || null;
    this.code = error.code || null;
  }
}

export class ClientError extends ServerError {
  constructor(httpStatus: number, error: ApiError) {
    super(httpStatus, error);
  }
}

export class AuthError extends ClientError {
  constructor(httpStatus: number, error: ApiError) {
    super(httpStatus, error);
  }
}

export class ForbiddenError extends ClientError {
  constructor(httpStatus: number, error: ApiError) {
    super(httpStatus, error);
  }
}

export class BadRequestError extends ClientError {
  constructor(httpStatus: number, error: ApiError) {
    super(httpStatus, error);
  }
}