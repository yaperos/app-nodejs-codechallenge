import { Injectable } from '@nestjs/common';
import { StreamingService } from 'src/streaming/streaming.service';
import { TransactionsPersistenceService } from 'src/transactions/infrastructure/out/transactions-persistence.service';
import { CreateTransactionCommand } from 'src/transactions/application/create-transaction-command';
import { Transaction, TransactionPrimitives } from 'src/transactions/domain/Transaction';
import { TransactionId } from 'src/transactions/domain/TransactionId';
import { TransactionExternalId } from 'src/transactions/domain/TransactionExternalId';
import { TransactionType } from 'src/transactions/domain/TransactionType';
import { TransactionStatus } from 'src/transactions/domain/TransactionStatus';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionsPersistenceService: TransactionsPersistenceService,
    private readonly stremingService: StreamingService,
  ) {}
  async createTransaction(command: CreateTransactionCommand): Promise<TransactionPrimitives> {
    const transaction = new Transaction(
      new TransactionId(),
      command.accountExternalIdDebit,
      command.accountExternalIdCredit,
      command.transferTypeId,
      new TransactionExternalId(),
      new TransactionType(),
      new TransactionStatus(),
      command.value,
    );

    const { uuid, value, transactionStatus, ...rest } = await this.transactionsPersistenceService.createTransaction(transaction);
    this.stremingService.publishEvent('transaction.pending', {
      uuid,
      value,
      transactionStatus,
    });

    return { uuid, value, transactionStatus, ...rest };
  }
}
