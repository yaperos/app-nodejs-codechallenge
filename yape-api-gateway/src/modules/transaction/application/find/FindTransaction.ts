import { Inject, Injectable } from '@nestjs/common';

import { InjectionToken } from 'src/modules/transaction/InjectionToken';
import { Transaction } from 'src/modules/transaction/domain/Transaction';
import { TransactionRepository } from 'src/modules/transaction/domain/TransactionRepository';
// import { TransactionNotFound } from 'src/modules/transaction/domain/errors';

interface Request {
  transactionId: number;
}

@Injectable()
export class FindTransaction {
  constructor(
    @Inject(InjectionToken.TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepository,
  ) {}

  async run({ transactionId }: Request): Promise<Transaction> {
    const transaction = await this.repository.findById(transactionId);
    return transaction;
  }
}
