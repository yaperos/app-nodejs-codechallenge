// src/transaction/controllers/transaction-consumer.controller.ts
import { Controller, Logger, Inject } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext, ClientKafka } from '@nestjs/microservices';
import { TransactionService } from '../services/transaction.service';
import { KAFKA_TOPIC_TRANSACTION_CREATED, TRANSACTION_SERVICE_KAFKA_CLIENT } from '../../shared/constants';
import { TransactionStatus } from '../enums/transaction-status.enum';

// Define the expected payload structure from the 'transaction_created' topic
interface TransactionCreatedPayload {
  transactionId: string; // Corresponds to transactionExternalId
  value: number;
  // other fields if needed...
}

@Controller() // No base path needed for Kafka controllers
export class TransactionConsumerController {
  private readonly logger = new Logger(TransactionConsumerController.name);
  private readonly ANTI_FRAUD_THRESHOLD = 1000;

  constructor(
    private readonly transactionService: TransactionService,
    // Optionally inject Kafka client if you need to produce messages from the consumer
    @Inject(TRANSACTION_SERVICE_KAFKA_CLIENT) private readonly kafkaClient: ClientKafka
  ) { }

  // Listen to the topic where new transactions are announced
  @MessagePattern(KAFKA_TOPIC_TRANSACTION_CREATED)
  async handleTransactionCreated(
    @Payload() message: any, // Raw message payload
    @Ctx() context: KafkaContext, // Kafka specific context
  ): Promise<void> { // Return void as we are not replying

    const offset = context.getMessage().offset;
    const partition = context.getPartition();
    const topic = context.getTopic();
    this.logger.log(`Received message from topic ${topic} [${partition}/${offset}]`);

    let payload: TransactionCreatedPayload;

    console.log(message, typeof message)

    try {
      // Assuming the message value is a JSON string
      payload = message
      // Basic validation of payload structure
      if (!payload || typeof payload !== 'object' || !payload.transactionId || typeof payload.value === 'undefined') {
        throw new Error('Invalid message payload structure');
      }
      this.logger.log(`Parsed Payload: ${JSON.stringify(payload)}`);
    } catch (error) {
      this.logger.error(`Failed to parse message payload or invalid structure: ${error.message}`, message.value?.toString());
      // Acknowledge message to prevent reprocessing bad data? Or move to DLQ?
      // For now, we'll log and skip. In prod, use a DLQ strategy.
      // await context.getConsumer().commitOffsets([{ topic, partition, offset: (Number(offset) + 1).toString() }]); // Manual commit example
      return; // Stop processing this message
    }

    // --- Anti-Fraud Logic ---
    // In a real microservice architecture, an external Anti-Fraud service
    // would perform this logic and potentially publish a *result* event.
    // Here, we simulate the logic directly within the consumer.
    let newStatus: TransactionStatus;
    if (payload.value > this.ANTI_FRAUD_THRESHOLD) {
      this.logger.log(`Transaction ${payload.transactionId} value (${payload.value}) exceeds threshold ${this.ANTI_FRAUD_THRESHOLD}. Rejecting.`);
      newStatus = TransactionStatus.REJECTED;
    } else {
      this.logger.log(`Transaction ${payload.transactionId} value (${payload.value}) is within threshold. Approving.`);
      newStatus = TransactionStatus.APPROVED;
    }
    // --- End Anti-Fraud Logic ---

    try {
      // Update the transaction status in the database
      await this.transactionService.updateTransactionStatus(payload.transactionId, newStatus);
      this.logger.log(`Successfully processed and updated status for transaction ${payload.transactionId} to ${newStatus}`);

      // Optional: Commit offset manually if not using auto-commit
      // await context.getConsumer().commitOffsets([{ topic, partition, offset: (Number(offset) + 1).toString() }]);

    } catch (error) {
      // Log error from the service (e.g., DB update failed, transaction not found)
      this.logger.error(`Error processing transaction ${payload.transactionId}: ${error.message}`, error.stack);
      // Decide on retry or DLQ based on the error type.
      // For now, the message might be reprocessed if auto-commit is off or fails.
      // Throwing an error here might cause the consumer to retry the message.
      // throw error; // Uncomment to potentially trigger retry
    }
  }

  // --- Optional: Dead Letter Queue (DLQ) Handling Example ---
  // You might have another pattern for a DLQ topic
  // @MessagePattern('transaction_processing_dlq')
  // async handleDlqMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
  //     this.logger.error(`Received message in DLQ: ${JSON.stringify(message)}`);
  //     // Implement logic for handling failed messages (logging, alerting, manual intervention)
  //     // Remember to commit offset for DLQ topic as well
  // }
}