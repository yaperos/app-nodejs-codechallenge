import { NextFunction, Request, Response } from "express";

export interface ITransactionHandler {
  createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getTransactionById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
