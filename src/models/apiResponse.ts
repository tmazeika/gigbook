import { NextApiHandler, NextApiResponse } from 'next';

export interface ApiError {
  message: string;
}

export function isApiError(v: unknown): v is ApiError {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as ApiError)?.message === 'string'
  );
}

export type ApiResponse<R = void> = NextApiResponse<R | ApiError>;

export type ApiHandler<R = void> = NextApiHandler<R | ApiError>;
