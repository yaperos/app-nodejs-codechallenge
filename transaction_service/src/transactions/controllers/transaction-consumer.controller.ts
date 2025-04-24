import { Controller, Logger, Inject } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext, ClientKafka } from '@nestjs/microservices';
import { TransactionService } from '../services/transaction.service';
import { KAFKA_TOPIC_TRANSACTION_VALIDATED, TRANSACTION_SERVICE_KAFKA_CLIENT } from '../../shared/constants';
import { TransactionStatus } from '../enums/transaction-status.enum';

interface TransactionCreatedPayload {
  transactionId: string;
  status: TransactionStatus;
}

@Controller()
export class TransactionConsumerController {
  private readonly logger = new Logger(TransactionConsumerController.name);

  constructor(
    private readonly transactionService: TransactionService,

    @Inject(TRANSACTION_SERVICE_KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka
  ) { }

  @MessagePattern(KAFKA_TOPIC_TRANSACTION_VALIDATED)
  async handleTransactionCreated(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ): Promise<void> {


    const offset = context.getMessage().offset;
    const partition = context.getPartition();
    const topic = context.getTopic();
    this.logger.log(`Received message from topic ${topic} [${partition}/${offset}]`);

    let payload: TransactionCreatedPayload;

    console.log(message, typeof message)

    try {
      payload = message
      if (!payload || typeof payload !== 'object' || !payload.transactionId || typeof payload.status === 'undefined') {
        throw new Error('Invalid message payload structure');
      }
      this.logger.log(`Parsed Payload: ${JSON.stringify(payload)}`);
    } catch (error) {
      this.logger.error(`Failed to parse message payload or invalid structure: ${error.message}`, message.value?.toString());
      throw new Error('Invalid message payload structure');
    }

    try {
      await this.transactionService.updateTransactionStatus(payload.transactionId, payload.status);
      this.logger.log(`Successfully processed and updated status for transaction ${payload.transactionId} to ${payload.status}`);

      await context.getConsumer().commitOffsets([{ topic, partition, offset: (Number(offset) + 1).toString() }]);

    } catch (error) {
      this.logger.error(`Error processing transaction ${payload.transactionId}: ${error.message}`, error.stack);

    }
  }
}