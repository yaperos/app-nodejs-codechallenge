import { NextFunction, Request, Response } from "express";
import { ITransactionPersistence } from "../../../../domain/transaction/objects/ITransactionPersistence";
import { ErrorHandler } from "../../../../../shared/domain/ErrorHandler";
import { GetTransactionService } from "../../../../application";

export class GetTransactionController {
  constructor(private getTransactionService: GetTransactionService) {}

  public async invoke(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ITransactionPersistence | any> {
    try {
      const response = await this.getTransactionService.invoke(req.body);
      res.status(200).json({ status: "success", data: response });
    } catch (error) {
      next(new ErrorHandler("Error get transaction", 400));
    }
  }
}
