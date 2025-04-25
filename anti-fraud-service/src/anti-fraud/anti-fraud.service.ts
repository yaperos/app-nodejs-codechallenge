import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { HandleTransactionDto } from './dto/handle-transaction.dto';
import { StatusTransaction } from './interfaces/status.interface';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  checkTransaction(value: number) {
    return value >= 1000
      ? StatusTransaction.REJECTED
      : StatusTransaction.APPROVED;
  }

  handleTransaction(transaction: HandleTransactionDto) {
    const status = this.checkTransaction(transaction.amount);

    this.kafkaClient.emit('transaction_updated', {
      transactionExternalId: transaction.transactionExternalId,
      transactionStatus: status,
    });
  }
}
