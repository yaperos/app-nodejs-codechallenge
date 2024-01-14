import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import { KAFKA_TOPICS } from '@/enums/kafka-topics.enum';
import { TransactionStatusEnum } from '@/enums/transaction-status.enum';
import { ITransaction } from '@/interfaces/transaction.interface';
import { KafkaService } from 'src/kafka/kafka.service';
import { Consumer } from 'kafkajs';

@Injectable()
export class AntifraudService implements OnApplicationShutdown {
  private readonly logger = new Logger(AntifraudService.name);
  private consumer: Consumer;

  constructor(private kafkaService: KafkaService) {
    this.consumer = this.kafkaService.createConsumer('antifraud-group');
    this.logger.log(`Consumer in ${AntifraudService.name} initialized.`);
    this.initializeKafkaConsumer();
  }

  private async initializeKafkaConsumer() {
    await this.kafkaService.subscribe(
      this.consumer,
      KAFKA_TOPICS.VALIDATE_TRANSACTION,
      this.handleTransaction.bind(this),
    );
  }

  async onApplicationShutdown() {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.logger.log(`Consumer in ${AntifraudService.name} disconnected.`);
    }
  }

  private handleTransaction(transaction: ITransaction): void {
    const { transactionExternalId, value } = transaction;
    const message = {
      transactionExternalId,
      status:
        value <= 1000
          ? TransactionStatusEnum.APPROVED
          : TransactionStatusEnum.REJECTED,
    };
    this.logger.log(
      `Transaction ${transactionExternalId} ${value <= 1000 ? 'approved' : 'rejected'}.`,
    );
    this.kafkaService.emit(KAFKA_TOPICS.UPDATE_TRANSACTION, message);
  }
}
