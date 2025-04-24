import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionStatusCommand } from '../impl/update-transaction-status.command';
import { TransactionRepository } from 'src/repository/transaction.repository';
import { EventStore } from 'src/events/event-store';
import { Logger } from '@nestjs/common';

@CommandHandler(UpdateTransactionStatusCommand)
export class UpdateTransactionStatusHandler
  implements ICommandHandler<UpdateTransactionStatusCommand>
{
  private readonly logger = new Logger(UpdateTransactionStatusCommand.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly eventStore: EventStore,
  ) {}

  async execute(command: UpdateTransactionStatusCommand) {
    this.logger.log({ command });

    const response = await this.transactionRepository.updateTransactionStatus(
      command.transactionId,
      command.statusId,
    );

    this.eventStore.onTransactionUpdatedEvent(response);

    return response;
  }
}
