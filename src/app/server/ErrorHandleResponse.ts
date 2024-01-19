import { NextFunction, Response, Request } from 'express';
import { BaseError } from '@context/shared/domain/class/BaseError';
import Logger from '@context/shared/infrastructure/impl/WinstonInfoLogger';

export const ErrorHandlerResponse = (error: Error, req: Request, res: Response, _next: NextFunction): Response => {
  printError(error, req);
  if (error instanceof BaseError) return res.status(error.status).send(error.info);
  return res.status(500).send();
};

const printError = (error: Error, req: Request): void => {
  Logger.info(`Error on request: ${req.originalUrl}`);
  Logger.info(`Error Stack: ${error.stack}`);
  Logger.info(error);
};
