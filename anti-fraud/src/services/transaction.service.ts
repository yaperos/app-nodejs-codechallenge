import { Injectable } from '@nestjs/common';
import { TRANSACTION_LIMIT } from 'src/common/transaction.type';
import { ValidateTransactionDto } from 'src/dto/transaction.dto';
import { TransactionEvent } from 'src/events/transaction.event';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionEvent: TransactionEvent) {}

  async validate(validateTransactionDto: ValidateTransactionDto) {
    if (validateTransactionDto.value > TRANSACTION_LIMIT) {
      this.transactionEvent.rejected(validateTransactionDto);
    } else {
      this.transactionEvent.approved(validateTransactionDto);
    }
  }
}
