import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../domain/ErrorHandler";
import { ILogger } from "../../domain/ILogger";

export class ErrorMiddleware {
  private defaultHttpError = 500;

  constructor(private logger: ILogger) {}

  public routeNotFindHandler = (req: Request, res: Response): void => {
    res.status(404).json({ message: "Route not found" });
  };

  public clientErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (!res.headersSent) {
      next(err);
    }
  };

  public customErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (err instanceof ErrorHandler) {
      this.logger.error(err.message);
      const { statusCode, message } = err;
      res.status(statusCode).json({
        status: statusCode,
        message: message,
      });
    } else {
      next(err);
    }
  };

  public globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    this.logger.error(err.message);
    return res.status(this.defaultHttpError).json({
      status: this.defaultHttpError,
      message: "Something wrong happened :`(",
    });
  };
}
