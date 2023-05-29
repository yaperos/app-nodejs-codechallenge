import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaProducerService } from 'src/adapters/externalServices/kafka/kafka.producer.service';
import { UpdateTransactionsDto } from '../dto/update.transactions.dto';
import { ITransactionsService } from 'src/ports/transactions/service/transactions.interface';

const configService = new ConfigService();

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Injectable()
export class TransactionsService implements ITransactionsService {
  constructor(private readonly producerService: KafkaProducerService) {}

  async sendTransactionToKafka(
    transactionId: string,
    status: TransactionStatus,
    topic: string,
  ) {
    const updateTransaction: UpdateTransactionsDto = {
      transactionId,
      status,
    };

    // Send transaction to kafka
    await this.producerService.produce({
      topic: topic,
      messages: [{ value: JSON.stringify(updateTransaction) }],
    });
  }

  async rejectTransaction(transactionId: string) {
    await this.sendTransactionToKafka(
      transactionId,
      TransactionStatus.REJECTED,
      configService.get('KAFKA_TOPIC_TRANSACTION_REJECTED'),
    );
  }

  async approveTransaction(transactionId: string) {
    await this.sendTransactionToKafka(
      transactionId,
      TransactionStatus.APPROVED,
      configService.get('KAFKA_TOPIC_TRANSACTION_APPROVED'),
    );
  }
}
