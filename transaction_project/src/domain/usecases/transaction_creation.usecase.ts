import { Injectable } from '@nestjs/common';

import { TransactionService } from '../../adapter/out/db/transaction.service';
import { Transaction } from '../models/transaction.interface';

@Injectable()
export class TransactionCreationUsecase {
  constructor(private transactionService: TransactionService) {}

  async create(transaction: Transaction) {
    console.log(
      'TransactionCreationUsecase: Create a transaction: ' +
        JSON.stringify(transaction),
    );
    const created: Transaction = await this.transactionService.create(
      transaction,
    );

    console.log(
      'TransactionCreationUsecase: Created: ' + JSON.stringify(created)
    );

    return created;
  }
}
