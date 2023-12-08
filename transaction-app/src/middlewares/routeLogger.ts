import { Request, Response, NextFunction } from 'express';
import logger from '../libs/logger';

export const routeLogger = async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const end = Date.now();
    const time = `${end - start}ms`;
    logger.debug('HTTP request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      time,
    });
  });
  next();
};
