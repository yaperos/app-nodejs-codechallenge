import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionStatusCommand } from '../impl/update-transaction-status.command';
import { TransactionRepository } from 'src/repository/transaction.repository';
import { EventStoreService } from 'src/events/event-store';

@CommandHandler(UpdateTransactionStatusCommand)
export class UpdateTransactionStatusHandler
  implements ICommandHandler<UpdateTransactionStatusCommand>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(command: UpdateTransactionStatusCommand) {
    console.log({ command });

    const response = await this.transactionRepository.updateTransactionStatus(
      command.transactionId,
      command.statusId,
    );

    this.eventStore.appendEvent('transaction.updated', response.id, response);

    return response;
  }
}
