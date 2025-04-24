import { Controller, Logger, Inject } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext, ClientKafka } from '@nestjs/microservices';
import { TransactionService } from '../services/transaction.service';
import { KAFKA_TOPIC_TRANSACTION_DEBEZIUM, KAFKA_TOPIC_TRANSACTION_VALIDATED, TRANSACTION_SERVICE_KAFKA_CLIENT } from '../../shared/constants';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionResponseDto } from '../dto/create-transaction-response.dto';

interface TransactionValidatedPayload {
  transactionExternalId: string;
  status: TransactionStatus;
}

export interface DebeziumTransactionPayload {
  id: string;
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  __op: string;
  __table: string;
  __source_ts_ms: number;
}

@Controller()
export class TransactionConsumerController {
  private readonly logger = new Logger(TransactionConsumerController.name);

  constructor(
    private readonly transactionService: TransactionService,

  ) { }

  @MessagePattern(KAFKA_TOPIC_TRANSACTION_VALIDATED)
  async handleTransactionValidated(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ): Promise<void> {

    const offset = context.getMessage().offset;
    const partition = context.getPartition();
    const topic = context.getTopic();
    this.logger.log(`Received message from topic ${topic} [${partition}/${offset}]`);

    let payload: TransactionValidatedPayload;

    console.log(message, typeof message)

    try {
      payload = message

      if (!payload || typeof payload !== 'object' || !payload.transactionExternalId || typeof payload.status === 'undefined') {
        throw new Error('Invalid message payload structure');
      }
      this.logger.log(`Parsed Payload: ${JSON.stringify(payload)}`);
    } catch (error) {
      this.logger.error(`Failed to parse message payload or invalid structure: ${error.message}`, message.value?.toString());
      throw new Error('Invalid message payload structure');
    }

    try {
      await this.transactionService.updateTransactionStatus(payload.transactionExternalId, payload.status);
      this.logger.log(`Successfully processed and updated status for transaction ${payload.transactionExternalId} to ${payload.status}`);

      await this.transactionService.updateCache(payload.transactionExternalId, { transactionStatus: { name: payload.status } });
      await context.getConsumer().commitOffsets([{ topic, partition, offset: (Number(offset) + 1).toString() }]);

    } catch (error) {
      this.logger.error(`Error processing transaction ${payload.transactionExternalId}: ${error.message}`, error.stack);
    }
  }

  @MessagePattern(KAFKA_TOPIC_TRANSACTION_DEBEZIUM)
  async handleTransactionDebezium(
    @Payload() message: any,
    @Ctx() context: KafkaContext
  ): Promise<void> {
    const offset = context.getMessage().offset;
    const partition = context.getPartition();
    const topic = context.getTopic();
    this.logger.log(`handleTransactionDebezium Received message from topic ${topic} [${partition}/${offset}]`);

    let payload: DebeziumTransactionPayload;
    console.log(message, typeof message)

    try {
      payload = message

      // Only process create events ('c') with valid 'after' data
      if (payload.__op !== 'c' || typeof payload.value === 'undefined') {
        this.logger.debug(`Ignoring Debezium payload (op: ${payload.__op}, missing data)`);
        return;
      }

      if (!payload || typeof payload !== 'object' || !payload.transactionExternalId || typeof payload.status === 'undefined') {
        throw new Error('Invalid message payload structure');
      }
      this.logger.log(`Parsed Payload: ${JSON.stringify(payload)}`);
    } catch (error) {
      this.logger.error(`Failed to parse message payload or invalid structure: ${error.message}`, message.value?.toString());
      throw new Error('Invalid message payload structure');
    }

    try {
      const transactionData = TransactionResponseDto.fromEntity(payload)
      await this.transactionService.updateCache(payload.transactionExternalId, transactionData);

      await context.getConsumer().commitOffsets([{ topic, partition, offset: (Number(offset) + 1).toString() }]);

    } catch (error) {
      this.logger.error(`Error processing transaction ${payload.transactionExternalId}: ${error.message}`, error.stack);
    }
  }

}