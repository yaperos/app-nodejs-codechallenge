import { Response, NextFunction } from 'express';
import { BaseController } from '@app/impl/BaseController';
import { TransactionService } from '@context/transactions/infrastructure/services/TransactionService';
export default class GetTransactionByIdController implements BaseController {
  constructor(private transactionService: TransactionService) {}
  async run(transactionId: any, _res: Response, _next: NextFunction) {
    return this.transactionService.getTransactionByExternalId(transactionId);
  }
}
