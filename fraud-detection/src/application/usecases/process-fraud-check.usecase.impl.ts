import { Injectable, Inject, Logger } from '@nestjs/common';
import { ProcessFraudCheckUseCase } from '../../domain/usecases/process-fraud-check.usecase';
import { TransactionCreatedMessageDto } from '../../domain/dto/transaction-created-message.dto';
import { FraudCheckTransaction } from '../../domain/entities/fraud-check-transaction';
import { EventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { KAFKA_PATTERNS } from '../../infrastructure/kafka/kafka.config';

@Injectable()
export class ProcessFraudCheckUseCaseImpl implements ProcessFraudCheckUseCase {
  private readonly logger = new Logger(ProcessFraudCheckUseCaseImpl.name);

  constructor(
    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(message: TransactionCreatedMessageDto): Promise<void> {
    const { transactionExternalId, value } = message;

    const transaction = new FraudCheckTransaction(transactionExternalId, value);

    await this.eventPublisher.publish(
      KAFKA_PATTERNS.TRANSACTION_STATUS_UPDATED,
      {
        transactionId: transactionExternalId,
        status: transaction.getStatus(),
      },
    );
  }
}
