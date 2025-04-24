import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { UpdateTransactionUseCase } from '@/modules/transaction/application/use-cases/update-transaction.use-case';

/**
 * Kafka consumer that listens to transaction events and applies antifraud logic.
 * 
 * It subscribes to the `transaction_created` topic and updates the transaction status
 * based on a configurable threshold value (`ANTIFRAUD_REJECT_LIMIT`).
 */
@Injectable()
export class AntifraudConsumer implements OnModuleInit {
  constructor(private readonly updateTransactionUseCase: UpdateTransactionUseCase) {}

  /**
   * Initializes the Kafka consumer when the module starts.
   * Connects to the broker, subscribes to the topic, and handles incoming messages.
   */
  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'antifraud-consumer',
      brokers: [(process.env.KAFKA_BROKER || 'localhost:9092')],
    });

    const consumer = kafka.consumer({ groupId: 'antifraud-group' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'transaction_created', fromBeginning: true });

    await consumer.run({
      /**
       * Handles each incoming Kafka message from the transaction_created topic.
       * Determines whether the transaction should be approved or rejected.
       *
       * @param message - Kafka message payload.
       */
      eachMessage: async ({ message }: EachMessagePayload) => {
        const value = message.value?.toString();
        if (!value) return;
  
        // Get threshold value from environment or fallback to default (1000)
        const REJECT_LIMIT = Number.isNaN(Number(process.env.ANTIFRAUD_REJECT_LIMIT))
        ? 1000
        : Number(process.env.ANTIFRAUD_REJECT_LIMIT);
        
        const data = JSON.parse(value);
        const statusId = data.value > REJECT_LIMIT ? 3 : 2; // 3 = rejected, 2 = approved

        // Update transaction status in the database
        await this.updateTransactionUseCase.execute(data.id, statusId);
      },
    });
  }
}
