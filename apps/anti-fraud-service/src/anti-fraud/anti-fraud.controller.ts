import { KAFKA_TOPICS, TransactionCreatedEvent } from '@app/shared';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';

@Controller()
export class AntiFraudController {
  private readonly logger = new Logger(AntiFraudController.name);

  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern(KAFKA_TOPICS.TRANSACTION_CREATED)
  async handleTransactionCreated(@Payload() data: TransactionCreatedEvent) {
    try {
      this.logger.log('event', data);

      this.logger.log(
        `Received transaction for validation: ${data.transactionId}`,
      );
      const result = await this.antiFraudService.validateTransaction(
        data.transactionId,
        data.value,
      );
      this.logger.log(
        `Validation result for ${data.transactionId}: ${result.statusCode}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error validating transaction ${data.transactionId}:`,
        error,
      );
      throw error;
    }
  }
}
