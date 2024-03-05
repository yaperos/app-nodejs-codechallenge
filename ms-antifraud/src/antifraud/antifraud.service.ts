import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionStatus } from 'src/common/enums/transaction';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,
  ) { }

  async verifyAntifraud(transaction: TransactionDto) {
    if (transaction.value <= 1000) transaction.transactionStatus = TransactionStatus.APPROVED;
    else transaction.transactionStatus = TransactionStatus.REJECTED;
    this.transactionClient.emit('transaction.update', JSON.stringify(transaction));
  }
}
