import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import { KAFKA_TOPICS } from '@/enums/kafka-topics.enum';
import { TransactionStatusEnum } from '@/enums/transaction-status.enum';
import { ITransaction } from '@/interfaces/transaction.interface';
import { KafkaService } from 'src/kafka/kafka.service';
import { Consumer, Producer } from 'kafkajs';

@Injectable()
export class AntifraudService implements OnApplicationShutdown {
  private readonly logger = new Logger(AntifraudService.name);
  private consumer: Consumer;
  private producer: Producer;

  constructor(private kafkaService: KafkaService) {
    const { consumer, producer } =
      this.kafkaService.initializeProducerAndConsumer('antifraud-group');
    this.initializeKafkaConsumerAndProducer(consumer, producer);
  }

  private async initializeKafkaConsumerAndProducer(
    consumer: Consumer,
    producer: Producer,
  ) {
    await consumer.connect();
    await producer.connect();
    this.consumer = consumer;
    this.producer = producer;
    await this.kafkaService.subscribe(
      this.consumer,
      KAFKA_TOPICS.VALIDATE_TRANSACTION,
      this.handleTransaction.bind(this),
    );
    this.logger.log(
      `Consumer and Producer in ${AntifraudService.name} initialized.`,
    );
  }

  /**
   * Handler to validate the new transaction event in kafka
   * @param {ITransaction} transaction - Body of a new transaction
   */
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
    this.kafkaService.emit(
      this.producer,
      KAFKA_TOPICS.UPDATE_TRANSACTION,
      message,
    );
  }

  async onApplicationShutdown() {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.logger.log(`Consumer in ${AntifraudService.name} disconnected.`);
    }
    if (this.producer) {
      await this.producer.disconnect();
      this.logger.log(`Producer in ${AntifraudService.name} disconnected.`);
    }
  }
}
