import { NextFunction, Request, Response } from "express";
import { ITransactionHandler } from "./transaction.interfaces";
export * from "./transaction.interfaces";

// TODO: Implement this handler
export class TransactionHandler implements ITransactionHandler {
  async createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    res.json({
      message: "createTransaction",
    });
    return;
  }

  async getTransactionById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    res.json({
      message: "getTransactionById",
    });
    return;
  }
}
