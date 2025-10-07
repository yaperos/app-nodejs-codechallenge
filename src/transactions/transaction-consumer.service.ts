import { KafkaService } from '@/kafka/kafka.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Transaction } from './models/transaction.model';
import { Logger } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AntiFraudService } from '@/third-parties/anti-fraud.service';

@Injectable()
export class TransactionConsumerService implements OnModuleInit {
  private readonly logger = new Logger(TransactionConsumerService.name);
  private TOPIC_NAME = 'transaction';

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly transactionService: TransactionService,
    private readonly antiFraudService: AntiFraudService,
  ) {}

  async onModuleInit() {
    try {
      await this.kafkaService.createTopic(this.TOPIC_NAME);
      this.logger.log(`Topic "${this.TOPIC_NAME}" is ready`);

      const consumer = this.kafkaService.createConsumer(
        process.env.KAFKA_CONSUMER_GROUP_ID ?? 'transaction-group',
      );
      await consumer.connect();
      this.logger.log('Consumer connected to Kafka');

      await consumer.subscribe({
        topic: this.TOPIC_NAME,
        fromBeginning: true,
      });

      this.logger.log(`Subscribed to topic "${this.TOPIC_NAME}"`);

      await consumer.run({
        eachBatch: async ({ batch }) => {
          const messages: Transaction[] = batch.messages.map(
            (message) =>
              JSON.parse(message.value?.toString() || '{}') as Transaction,
          );
          await Promise.all(
            messages.map((message) => this.handleTransaction(message)),
          );
        },
      });
      this.logger.log('Consumer is running and ready to process messages');
    } catch (error) {
      this.logger.error('Failed to initialize consumer:', error);
    }
  }

  private async handleTransaction(message: Transaction): Promise<void> {
    this.logger.log('Received message:', message);

    const existing = await this.transactionService.findById(message.id);
    if (!existing) {
      this.logger.warn(
        `Transaction ${message.id} not found in database, skipping`,
      );
      return;
    }

    if (existing.transactionStatus.name !== 'PENDING') {
      this.logger.log(
        `Transaction ${message.id} already processed with status ${existing.transactionStatus.name}, skipping`,
      );
      return;
    }

    const isSuspicious = this.antiFraudService.isSuspicious(message);
    const updatedTransaction = await this.transactionService.update({
      id: message.id,
      status: isSuspicious ? 'REJECTED' : 'APPROVED',
    });

    this.logger.log('Transaction processed:', updatedTransaction);
  }
}
