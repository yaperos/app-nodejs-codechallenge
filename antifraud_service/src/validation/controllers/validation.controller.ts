import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { ValidationService } from '../services/validation.service';
import { KAFKA_TOPIC_TRANSACTION_DEBEZIUM } from 'src/shared/constants';
import { TransactionStatus } from '../enums/transaction-status.enum';

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
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);

  constructor(private readonly validationService: ValidationService) { }

  @MessagePattern(KAFKA_TOPIC_TRANSACTION_DEBEZIUM || 'transactions.public.transactions')
  async handleTransactionDebezium(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    this.logger.log(`Received message from topic ${context.getTopic()}`);
    this.logger.log(`Received message: ${JSON.stringify(message), typeof message}`);

    const { offset } = context.getMessage();
    const topic = context.getTopic();
    const partition = context.getPartition();


    this.logger.debug(`[<span class="math-inline">\{topic\}/</span>{partition}/${offset}] ANTIFRAUD_SERVICE received Debezium event`);
    try {
      const event: DebeziumTransactionPayload = message
      console.log(event, typeof event)

      // Only process create events ('c') with valid 'after' data
      if (event.__op !== 'c' || typeof event.value === 'undefined') {
        this.logger.debug(`Ignoring Debezium event (op: ${event.__op}, missing data)`);
        return;
      }

      const transactionExternalId = event.transactionExternalId;
      const value = Number(event.value);

      if (isNaN(value)) {
        throw new Error(`Invalid value received for ${transactionExternalId}: ${event.value}`);
      }

      this.logger.log(`Processing transaction for validation: ${transactionExternalId}, Value: ${value}`);
      await this.validationService.validateAndPublish(transactionExternalId, value);

      await context.getConsumer().commitOffsets([{ topic, partition, offset: (Number(offset) + 1).toString() }]);

    } catch (error) {
      this.logger.error(`Error processing transaction event in ANTIFRAUD [<span class="math-inline">\{topic\}/</span>{partition}/${offset}]: ${error.message}`, error.stack);
      // DLQ strategy
    }
  }
}