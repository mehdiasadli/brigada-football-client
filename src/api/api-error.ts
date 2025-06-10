/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  details: null | {
    databaseError?: {
      code: string;
      clientVersion: string;
      meta: Record<string, any>;
    };
    errors?: Array<{
      path: string;
      message: string;
    }>;
    meta?: Record<string, any>;
  };
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly timestamp: string;
  public readonly path: string;
  public readonly method: string;
  public readonly details: null | {
    databaseError?: {
      code: string;
      clientVersion: string;
      meta: Record<string, any>;
    };
    errors?: Array<{
      path: string;
      message: string;
    }>;
    meta?: Record<string, any>;
  };

  constructor(readonly response: ErrorResponse) {
    super(response.message);

    this.name = 'ApiError';

    this.response = response;
    this.status = response.status;
    this.timestamp = response.timestamp;
    this.path = response.path;
    this.method = response.method;
    this.details = response.details;
  }

  static isStructuredError(error: AxiosError<any>): error is AxiosError<ErrorResponse> {
    return (
      error.response?.data !== undefined &&
      error.response.data !== null &&
      typeof error.response.data.status === 'number' &&
      typeof error.response.data.message === 'string' &&
      typeof error.response.data.timestamp === 'string' &&
      typeof error.response.data.path === 'string' &&
      typeof error.response.data.method === 'string' &&
      (error.response.data.details === null ||
        (typeof error.response.data.details === 'object' && error.response.data.details !== null))
    );
  }

  static fromResponse(error: AxiosError | Error) {
    if (error instanceof AxiosError) {
      if (ApiError.isStructuredError(error)) {
        return new ApiError(error.response!.data);
      }
    }

    return new ApiError({
      status: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: '',
      method: '',
      details: null,
    });
  }
}
