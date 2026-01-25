import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/apiHelpers.js';

export const validate = (schema: ZodObject<any>) => (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues.map((e) => e.message).join(', ');
      next(new ApiError(`Validation failed: ${messages}`, 400));
    } else {
      next(error);
    }
  }
};
