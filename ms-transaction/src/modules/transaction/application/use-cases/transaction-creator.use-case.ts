import { Inject } from '@nestjs/common';
import { EventBrokerService } from 'src/modules/shared/domain/services/event-broker.service';
import { TransactionCacheService } from 'src/modules/transaction/domain/services/transaction-cache.service';
import { Transaction } from 'src/modules/transaction/domain/transaction';
import {
  TRANSACTION_REPOSITORY_ALIAS,
  TransactionRepository,
} from 'src/modules/transaction/domain/transaction.repository';
import { TransactionAccountExternalId } from 'src/modules/transaction/domain/transaction-account-external-id';
import { TransactionAmount } from 'src/modules/transaction/domain/transaction-amount';
import { TransactionId } from 'src/modules/transaction/domain/transaction-id';
import { TransactionTransferType } from 'src/modules/transaction/domain/transaction-transfer-type';

export class TransactionCreator {
  constructor(
    @Inject(TRANSACTION_REPOSITORY_ALIAS)
    private readonly transactionRepository: TransactionRepository,
    private readonly eventBrokerService: EventBrokerService,
    private readonly transactionCacheService: TransactionCacheService,
  ) {}

  async run(
    id: string,
    creditAccountExternalId: string,
    debitAccountExternalId: string,
    amount: number,
    transferType: string,
  ): Promise<Transaction> {
    const transaction = Transaction.create({
      id: new TransactionId(id),
      creditAccountExternalId: new TransactionAccountExternalId(
        creditAccountExternalId,
      ),
      debitAccountExternalId: new TransactionAccountExternalId(
        debitAccountExternalId,
      ),
      amount: new TransactionAmount(amount),
      transferType: TransactionTransferType.fromValue(transferType),
    });
    await this.transactionRepository.createTransaction(transaction);

    this.eventBrokerService.publish(transaction.pullDomainEvents());
    this.transactionCacheService.set(transaction);

    return transaction;
  }
}
