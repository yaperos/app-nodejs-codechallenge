import { EventStore } from 'src/events/event-store';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../impl/create-transaction.command';
import { TransactionRepository } from 'src/repository/transaction.repository';
import { TransactionModel } from 'src/models/transaction.model';
import { TransactionTypeModel } from 'src/models/transaction-type.model';
import { TransactionStatusModel } from 'src/models/transaction-status.model';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly eventStore: EventStore,
  ) {}

  async execute(command: CreateTransactionCommand) {
    const response = await this.transactionRepository.createTransaction({
      accountExternalIdCredit: command.accountExternalIdDebit,
      accountExternalIdDebit: command.accountExternalIdCredit,
      value: command.value,
      transferTypeId: command.transferTypeId,
    });

    const transaction = new TransactionModel(
      response.id,
      response.accountDebit,
      response.accountCredit,
      response.value,
      response.transferTypeId,
      response.statusId,
      response.createdAt,
      response.updatedAt,
      new TransactionTypeModel(
        response.transferType.id,
        response.transferType.name,
      ),
      new TransactionStatusModel(response.status.id, response.status.name),
    );

    this.eventStore.onTransactionCreatedEvent(transaction);

    return {
      transactionExternalId: response.id,
      transactionType: {
        name: response.transferType.name,
      },
      transactionStatus: {
        name: response.status.name,
      },
      value: response.value,
      createdAt: response.createdAt,
    };
  }
}
