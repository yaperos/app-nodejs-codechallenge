import { Router } from "express";

export const groupMiddleware = (middlewares: any[], router: Router) => {
  middlewares.forEach((middleware) => router.use(middleware));
  return router;
};
