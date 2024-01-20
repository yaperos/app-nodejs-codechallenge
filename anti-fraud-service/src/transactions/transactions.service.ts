import { Injectable } from '@nestjs/common';
import { TRANSACTION_STATUS } from 'src/constants/kafka.constants';
import { ERROR_MESSAGES } from 'src/constants/error-messages.constants';
import { TransactionDto } from 'src/dto/transaction.dto';

@Injectable()
export class TransactionsService {
  validate(transaction: TransactionDto): string {
    if (!transaction || transaction.value === undefined) {
      throw new Error(ERROR_MESSAGES.TransactionValidation);
    }
    return transaction.value > 1000
      ? TRANSACTION_STATUS.Rejected
      : TRANSACTION_STATUS.Approved;
  }
}
