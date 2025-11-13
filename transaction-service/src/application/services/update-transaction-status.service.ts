import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionStatusChangedEvent } from '@domain/transaction';
import { TransactionRepository } from '@ports/out/transaction-repository';
import { TRANSACTION_REPOSITORY } from '@ports/tokens';

@Injectable()
export class UpdateTransactionStatusService {
  private readonly logger = new Logger(UpdateTransactionStatusService.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async handle(event: TransactionStatusChangedEvent): Promise<void> {
    this.logger.debug(
      `Updating transaction ${event.transactionExternalId} to status ${event.status}`,
    );

    await this.transactionRepository.updateStatus(
      event.transactionExternalId,
      event.status,
    );
  }
}
