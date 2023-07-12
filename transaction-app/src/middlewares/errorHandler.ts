import { Request, Response, NextFunction } from 'express';
import logger from '../libs/logger';
import { IError } from '../libs/errors';

export const errorHandler = async (err: IError, req: Request, res: Response, next: NextFunction) => {
  let payload = {
    app: process.env.APP_NAME,
    error: err.message,
    status: err.statusCode || 500,
    validations: err.validations,
    stack: process.env.NODE_ENV == 'production' ? undefined : err.stack,
  };

  logger.error(err.message, { ...payload, stack: err.stack });

  return res.status(err.statusCode || 500).json(payload);
};
