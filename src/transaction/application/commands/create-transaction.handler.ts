import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryPort,
} from '../ports/transaction.repository.port.js';
import { CreateTransactionCommand } from './create-transaction.command.js';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepositoryPort,
  ) {}

  async execute(
    command: CreateTransactionCommand,
  ): Promise<{ transactionExternalId: string }> {
    return this.repository.createWithOutbox({
      accountExternalIdDebit: command.accountExternalIdDebit,
      accountExternalIdCredit: command.accountExternalIdCredit,
      transferTypeId: command.transferTypeId,
      value: command.value,
    });
  }
}
