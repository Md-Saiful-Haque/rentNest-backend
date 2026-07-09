import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from "http-status";

export const catchAsync = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error: unknown) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to register user",
        error: (error as Error).message
      })
      // next(error);
    }
  };
};