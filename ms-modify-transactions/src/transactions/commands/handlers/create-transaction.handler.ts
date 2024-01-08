import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../create-transaction.command';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';
import { EventBusService } from 'src/config/events/event-bus.service';
import { plainToInstance } from 'class-transformer';
import { TransactionCreatedEvent } from 'src/transactions/events/transaction-created.event';
import { TransactionModel } from 'src/transactions/models/transaction.model';
import { TransactionStatusEnum } from 'src/utils/constants';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private repository: TransactionRepository,
    private eventBusService: EventBusService,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<TransactionModel> {
    const transactionData = {
      accountExternalIdCredit: command.accountExternalIdCredit,
      accountExternalIdDebit: command.accountExternalIdDebit,
      transferTypeId: command.transferTypeId,
      value: command.value,
      createdAt: undefined,
      modifiedAt: undefined,
      transactionStatusId: TransactionStatusEnum.Pending,
      transactionExternalId: undefined,
    };

    const transaction = await this.repository.createTransaction(
      transactionData,
    );

    const createdEvent = plainToInstance(TransactionCreatedEvent, transaction, {
      excludeExtraneousValues: true,
    });

    this.eventBusService.publish(createdEvent);

    return plainToInstance(TransactionModel, transaction);
  }
}
