import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import logger from '../libs/logger';

export const correlator = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  res.setHeader('x-correlation-id', correlationId);
  logger.defaultMeta = { correlationId: correlationId };
  next();
};
