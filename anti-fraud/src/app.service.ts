import { Injectable } from '@nestjs/common';
import { TransactionStatus } from './enum/transaction-status.enum';
import { ITransaction } from './interface/transaction.interface';

@Injectable()
export class AppService {
  validateTransaction(transaction: ITransaction): number {
    const transactionStatus =
      transaction.value > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;

    return transactionStatus;
  }
}
