import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { ValidationService } from '../services/validation.service';

interface DebeziumTransactionPayload {
  op: string;
  after?: {
    transaction_external_id?: string;
    value?: number | string; // Debezium might send decimals as strings
  };
  // Other fields ignored by AFVAL
}

@Controller()
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);

  constructor(private readonly validationService: ValidationService) { }

  @MessagePattern(process.env.KAFKA_TOPIC_DEBEZIUM_TX || 'txmng.public.transactions')
  async handleTransactionCreated(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const topic = context.getTopic();
    const { offset } = context.getMessage();
    const partition = context.getPartition();

    this.logger.debug(`[<span class="math-inline">\{topic\}/</span>{partition}/${offset}] AFVAL received Debezium event`);
    try {
      const event: DebeziumTransactionPayload = JSON.parse(message.value.toString());

      // Only process create events ('c') with valid 'after' data
      if (event.op !== 'c' || !event.after || !event.after.transaction_external_id || typeof event.after.value === 'undefined') {
        this.logger.debug(`Ignoring Debezium event (op: ${event.op}, missing data)`);
        return;
      }

      const transactionId = event.after.transaction_external_id;
      const value = Number(event.after.value); // Ensure it's a number

      if (isNaN(value)) {
        throw new Error(`Invalid value received for ${transactionId}: ${event.after.value}`);
      }

      this.logger.log(`Processing transaction for validation: ${transactionId}, Value: ${value}`);
      await this.validationService.validateAndPublish(transactionId, value);

    } catch (error) {
      this.logger.error(`Error processing transaction event in AFVAL [<span class="math-inline">\{topic\}/</span>{partition}/${offset}]: ${error.message}`, error.stack);
      // DLQ strategy
    }
  }
}