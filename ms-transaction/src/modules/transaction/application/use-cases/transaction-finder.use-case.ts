import { Inject } from '@nestjs/common';
import { TransactionService } from 'src/modules/transaction/domain/services/transaction.service';
import { Transaction } from 'src/modules/transaction/domain/transaction';
import {
  TRANSACTION_REPOSITORY_ALIAS,
  TransactionRepository,
} from 'src/modules/transaction/domain/transaction.repository';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';

export class TransactionFinder {
  private readonly transactionService: TransactionService;

  constructor(
    @Inject(TRANSACTION_REPOSITORY_ALIAS)
    private readonly transactionRepository: TransactionRepository,
  ) {
    this.transactionService = new TransactionService(
      this.transactionRepository,
    );
  }

  async run(criteria: TransactionCriteria): Promise<Transaction> {
    return this.transactionService.findOne(criteria);
  }
}
