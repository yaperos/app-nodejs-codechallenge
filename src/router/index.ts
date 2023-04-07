export * from "./transaction";
import { Express, Router } from "express";
import { IBaseRouter, IMainRouter } from "./router.interface";

type dependencies = {
  transactionRouter: IBaseRouter;
};

export class MainRouter implements IMainRouter {
  router: Router;
  private _transactionRouter: IBaseRouter;

  constructor({ transactionRouter }: dependencies) {
    this._transactionRouter = transactionRouter;

    this.router = Router();
  }

  setupRouters(server: Express) {
    this._transactionRouter.setupRouter(this.router);

    server.use("/v1/api", this.router);
  }
}
