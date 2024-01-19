import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from 'src/modules/shared/domain/errors';
// import { EventBrokerService } from 'src/modules/shared/domain/services/event-broker.service';
import { TransactionRejectedEvent } from 'src/modules/transaction/domain/events/transaction-rejected.event';
import { TransactionService } from 'src/modules/transaction/domain/services/transaction.service';
import { TransactionCacheService } from 'src/modules/transaction/domain/services/transaction-cache.service';
import {
  TRANSACTION_REPOSITORY_ALIAS,
  TransactionRepository,
} from 'src/modules/transaction/domain/transaction.repository';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';
import { ValidationStatus } from 'src/modules/transaction/domain/transaction-validation-status';

@Injectable()
export class TransactionRejectedHandler {
  private readonly transactionService: TransactionService;

  constructor(
    @Inject(TRANSACTION_REPOSITORY_ALIAS)
    private readonly transactionRepository: TransactionRepository,
    // private readonly eventBrokerService: EventBrokerService,
    private readonly transactionCacheService: TransactionCacheService,
  ) {
    this.transactionService = new TransactionService(
      this.transactionRepository,
    );
  }

  async run(event: TransactionRejectedEvent): Promise<void> {
    const transaction = await this.transactionService.findOne(
      TransactionCriteria.createById(event.aggregateId),
    );

    if (transaction.getValidationStatus() !== ValidationStatus.PENDING) {
      throw new ConflictError('Validation status is not "pending"');
    }
    transaction.rejectTransaction();

    await this.transactionRepository.updateTransaction(transaction);

    // this.eventBrokerService.publish(transaction.pullDomainEvents());
    this.transactionCacheService.set(transaction);
  }
}
