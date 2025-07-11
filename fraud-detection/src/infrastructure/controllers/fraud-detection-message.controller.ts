import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProcessFraudCheckUseCase } from '../../domain/usecases/process-fraud-check.usecase';
import { TransactionCreatedMessageDto } from '../../domain/dto/transaction-created-message.dto';
import { KAFKA_PATTERNS } from '../kafka/kafka.config';

@Controller()
export class FraudDetectionMessageController {
  private readonly logger = new Logger(FraudDetectionMessageController.name);

  constructor(
    @Inject('ProcessFraudCheckUseCase')
    private readonly processFraudCheckUseCase: ProcessFraudCheckUseCase,
  ) {}

  @EventPattern(KAFKA_PATTERNS.TRANSACTION_CREATED)
  async handleTransactionCreated(
    @Payload() message: TransactionCreatedMessageDto,
  ): Promise<void> {
    try {
      await this.processFraudCheckUseCase.execute(message);
    } catch (error) {
      this.logger.error('Error processing fraud check:', error);
      throw error;
    }
  }
}
