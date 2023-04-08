import { NextFunction, Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";
import { ZodError } from "zod";
import { BadRequestError } from "../../error";
import { CreateTransactionBodySchema } from "./schemas";
import { ITransactionHandler } from "./transaction.interfaces";

export * from "./transaction.interfaces";

export class TransactionHandler implements ITransactionHandler {
  async createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createTransactionBodyData = CreateTransactionBodySchema.parse(
        req.body
      );

      res.status(200).json({
        transactionId: uuidV4(),
        message: "createTransaction",
      });
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new BadRequestError(
            400,
            error.issues.map((issue) => issue.message)
          )
        );
        return;
      }

      next(error);
      return;
    }
  }

  async getTransactionById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { transactionId } = req.params;

      res.status(200).json(transactionId);
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
}
