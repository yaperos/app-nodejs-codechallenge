import { Inject, Injectable } from '@nestjs/common';
import { TransactionDto } from './dtos/create-transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatusDto } from './dtos/transaction-status.dto';

@Injectable()
export class AppService {
  public constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}
  public validateTransaction(transaction: TransactionDto): string {
    return transaction.value > 1000 ? 'rejected' : 'approved';
  }

  public async sendTransactionStatus(
    transactionStatus: TransactionStatusDto,
  ): Promise<void> {
    if (transactionStatus.transactionStatus.name === 'rejected') {
      this.kafkaClient.emit(
        'transaction_status_topic.rejected',
        JSON.stringify(transactionStatus),
      );
    }
    if (transactionStatus.transactionStatus.name === 'approved') {
      this.kafkaClient.emit(
        'transaction_status_topic.approved',
        JSON.stringify(transactionStatus),
      );
    }
  }
}