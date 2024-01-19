import { Response, NextFunction } from 'express';
import { BaseController } from '@app/impl/BaseController';
import { TransactionService } from '@context/transactions/infrastructure/services/TransactionService';
import Transaction from '@context/transactions/domain/class/Transaction';
export default class CreateTransactionController implements BaseController {
  constructor(private transactionService: TransactionService) {}
  async run(transactionData: Transaction, _res: Response, _next: NextFunction) {
    return this.transactionService.transactionHandler(transactionData)
  }
}
