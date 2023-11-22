import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ErrorResponse.prototype);
  }
}

export const errorHandler = async(
  err: ErrorResponse,
  _req: Request,
  res: Response,
  next: NextFunction
) =>{
  logger.error(err.stack || err);

  const statusCode = err.statusCode || 500;

  const message =
    process.env.NODE_ENV === "develop"
      ? err.message
      : "Internal Server Error";
      
  const errorDetails =
    process.env.NODE_ENV === "develop"
      ? {
          message: err.message,
          stack: err.stack,
        }
      : {};

  res.status(statusCode).json({
    error: {
      message,
      ...errorDetails,
    },
  });
}
