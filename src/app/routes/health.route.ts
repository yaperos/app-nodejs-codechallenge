import { Router, Request, Response, NextFunction } from 'express';

export const register = (router: Router) => {
  router.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
    return res.json({status: 'OK!'})
  });
};
