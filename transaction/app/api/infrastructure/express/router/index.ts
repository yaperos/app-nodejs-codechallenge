import { Router } from "express";
import * as controllers from "../controllers";

export const ApiRouter = (
  indexController: controllers.IndexController,
  createTransactionController: controllers.CreateTransactionController,
  getTransactionController: controllers.GetTransactionController
): Router => {
  const apiRouter = Router();
  const v1Router = Router();

  apiRouter.get("/", indexController.invoke.bind(indexController));
  v1Router.post(
    "/createTransaction",
    createTransactionController.validate,
    createTransactionController.invoke.bind(createTransactionController)
  );
  v1Router.get(
    "/getTransaction",
    getTransactionController.invoke.bind(getTransactionController)
  );

  apiRouter.use("/api/v1", v1Router);

  return apiRouter;
};
