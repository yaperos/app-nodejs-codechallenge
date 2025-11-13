import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateTransactionCommand } from '@application/commands/create-transaction.command';
import { Transaction, createPendingTransaction, toTransactionCreatedEvent } from '@domain/transaction';
import { OutboxMessage } from '@domain/outbox';
import { CreateTransactionUseCase } from '@ports/in/create-transaction.use-case';
import { TRANSACTION_REPOSITORY } from '@ports/tokens';
import { TransactionRepository } from '@ports/out/transaction-repository';
import { TRANSACTIONS_CREATED_TOPIC } from '@adapters/messaging/constants';

@Injectable()
export class CreateTransactionService implements CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    const now = new Date();
    const transaction = createPendingTransaction({
      transactionExternalId: command.transactionExternalId ?? randomUUID(),
      accountExternalIdDebit: command.accountExternalIdDebit,
      accountExternalIdCredit: command.accountExternalIdCredit,
      transferTypeId: command.transferTypeId,
      value: command.value,
      createdAt: now,
    });

    const event = toTransactionCreatedEvent(transaction);
    const outboxMessage: OutboxMessage = {
      topic: TRANSACTIONS_CREATED_TOPIC,
      key: transaction.transactionExternalId,
      payload: {
        ...event,
        createdAt: event.createdAt.getTime(),
      },
      nextAttemptAt: now,
    };

    return this.transactionRepository.createWithOutbox(transaction, outboxMessage);
  }
}
