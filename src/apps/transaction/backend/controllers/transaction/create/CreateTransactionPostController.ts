import { Response } from 'express';
import { BaseController } from '../../../../../../Contexts/Shared/infrastructure/api/BaseController';
import { HttpRequest } from '../../../../../../Contexts/Shared/domain/HttpRequest';
import { CreateTransaction } from '../../../../../../Contexts/Transaction/transaction/application/create/CreateTransaction';

export class CreateTransactionPostController extends BaseController {
  constructor(private readonly service: CreateTransaction) {
    super();
  }

  async handle(httpRequest: HttpRequest, httpResponse: Response): Promise<void> {
    try {
      const res = await this.service.run({ ...httpRequest.body });
      this.ok(httpResponse, res);
    } catch (error) {
      this.fail(httpResponse, error);
    }
  }
}
