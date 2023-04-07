import { Router } from "express";
import { ITransactionHandler } from "../../handler";
import { IBaseRouter } from "../router.interface";

type dependencies = {
  transactionHandler: ITransactionHandler;
};

export class TransactionRouter implements IBaseRouter {
  private readonly routerName = "transaction";
  private router: Router;
  private readonly _transactionHandler: ITransactionHandler;

  constructor({ transactionHandler }: dependencies) {
    this._transactionHandler = transactionHandler;

    this.router = Router();
  }

  setupRouter(mainRouter: Router) {
    this.router.post("/", this._transactionHandler.createTransaction);
    this.router.get(
      "/:transactionId",
      this._transactionHandler.getTransactionById
    );

    mainRouter.use(`/${this.routerName}`, this.router);
  }
}
