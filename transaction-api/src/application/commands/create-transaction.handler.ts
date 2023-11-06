import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';
import { TransactionRepository } from 'src/domain/repositories';
import { Transaction } from 'src/domain/models';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand, Transaction>
{
  constructor(
    @Inject(TransactionRepository) private repository: TransactionRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateTransactionCommand) {
    let transaction = await this.repository.add(command);
    transaction = this.publisher.mergeObjectContext(transaction);
    transaction.notifyPendingStatus();
    transaction.commit();
    return transaction;
  }
}
