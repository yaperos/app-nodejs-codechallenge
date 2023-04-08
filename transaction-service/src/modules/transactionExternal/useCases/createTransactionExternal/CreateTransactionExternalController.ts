/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateTransactionExternal } from "./CreateTransactionExternal";
import * as express from "express";
import { TransactionExternalDTO } from "./CreateTransactionExternalDTO";
import { CreateTransactionExternalErrors } from "./CreateTransactionExternalErrors";
import { BaseController } from "../../infra/http/models/BaseController";

export class CreateTransactionExternalController extends BaseController {
  private useCase: CreateTransactionExternal;

  constructor(useCase: CreateTransactionExternal) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto = req.body as TransactionExternalDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case CreateTransactionExternalErrors.AccountExternalDoNotExists:
            return this.conflict(res, error.getErrorValue().message);
          case CreateTransactionExternalErrors.InvalidTransactionExternalAmount:
            return this.conflict(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue());
        }
      } else {
        return this.ok(res);
      }
    } catch (error) {
      return this.fail(res, error as Error | string);
    }
  }
}
