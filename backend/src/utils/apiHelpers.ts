/**
 * Custom API Error Class
 * Extends Error with HTTP status code for consistent error handling
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 * Eliminates need for try-catch in every controller
 */
import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Standard API Response Helper
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message?: string
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Pagination Helper
 */
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (query: PaginationQuery): PaginationResult => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || '10', 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
