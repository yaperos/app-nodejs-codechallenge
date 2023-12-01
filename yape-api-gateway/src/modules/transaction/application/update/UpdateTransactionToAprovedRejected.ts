import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../InjectionToken';
import { TransactionRepository } from '../../domain/TransactionRepository';
import { STATUS, Transaction } from '../../domain/Transaction';

interface Request {
  transactionId: number;
  status: STATUS;
}
export class UpdateTransactionToAprovedRejected {
  constructor(
    @Inject(InjectionToken.TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepository,
  ) {}

  async run({ transactionId, status }: Request): Promise<Transaction> {
    const transaction = await this.repository.findById(transactionId);
    if (transaction) {
      transaction.setStatus(status);
      await this.repository.save(transaction);
      return transaction;
    }
    return;
  }
}
