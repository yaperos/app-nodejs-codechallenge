import { Request, Response, NextFunction } from 'express';
import logger from '../libs/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  logger.debug('Authenticating call for public API');
  next();
};

export const internalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  logger.debug('Authenticating call for internal API');
  next();
};
