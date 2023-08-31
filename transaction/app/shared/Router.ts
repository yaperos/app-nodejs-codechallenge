import { Router as ExpressRouter } from "express";
import helmet from "helmet";
import cors from "cors";
import bodyparser from "body-parser";
import { ErrorMiddleware } from "./infrastructure/express/errorMiddleware";

export const Router = (
  apiRouter: ExpressRouter,
  errorMiddleware: ErrorMiddleware
): ExpressRouter => {
  const router = ExpressRouter();
  router
    .use(helmet())
    .use(cors())
    .use(bodyparser.json())
    .use(bodyparser.urlencoded({ extended: false }));

  router.use(apiRouter);
  router.use(errorMiddleware.routeNotFindHandler);
  router.use(errorMiddleware.clientErrorHandler);
  router.use(errorMiddleware.customErrorHandler);
  router.use(errorMiddleware.globalErrorHandler);

  return router;
};
