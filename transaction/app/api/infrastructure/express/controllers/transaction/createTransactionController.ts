import { NextFunction, Request, Response } from "express";
import { CreateTransactionService } from "../../../../application/transaction/createTransactionService";
import { ErrorHandler } from "../../../../../shared/domain/ErrorHandler";
import { body } from "express-validator";
import { RequestValidator } from "../../../../../shared/infrastructure/express/requestValidator";

export class CreateTransactionController {
  constructor(private createTransactionService: CreateTransactionService) {}

  public validate = [body().notEmpty(), RequestValidator];

  public async invoke(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await this.createTransactionService.invoke(req.body);
      res.status(200).json({ status: "success" });
    } catch (error) {
      next(new ErrorHandler("Error creating transaction", 400));
    }
  }
}
