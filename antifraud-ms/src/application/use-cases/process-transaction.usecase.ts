import { Injectable } from '@nestjs/common';
import { TransactionModel } from 'src/domain/models/transaction.model';

@Injectable()
export class ProcessTransactionUseCase {
  async execute(transaction: TransactionModel): Promise<string> {
    if (transaction.value > 1000) {
      return 'REJECTED';
    }
    return 'APPROVED';
  }
}
