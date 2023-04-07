/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetTransactionExternal } from './GetTransactionExternal';
import * as express from 'express';
import { GetTransactionExternalDTO } from './GetTransactionExternalDTO';
import { TransactionMap } from '../../mappers';
import { UseCaseError } from 'clean-common-lib';
import { BaseController } from '../../infra/http/models/BaseController';

export class GetTransactionExternalController extends BaseController {
  private useCase: GetTransactionExternal;

  constructor(useCase: GetTransactionExternal) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto = req.body as GetTransactionExternalDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        return this.fail(
          res,
          (result.value.getErrorValue() as UseCaseError).message
        );
      } else {
        return this.ok(res, {
          transantion: TransactionMap.toDTO(result.value.getValue()),
        });
      }
    } catch (error) {
      return this.fail(res, error as Error | string);
    }
  }
}
