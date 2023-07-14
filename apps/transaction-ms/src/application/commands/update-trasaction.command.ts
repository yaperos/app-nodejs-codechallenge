import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionStatusEnum } from '../../domain/enums/transaction.enum';
import { TransactionUpdatedEvent } from '../../domain/events/transaction-updated.event';
import { ClientKafka } from '@nestjs/microservices';

export class UpdateTransactionCommand implements ICommand {
  constructor(
    readonly transactionExternalId: string,
    readonly transactionStatus: string,
  ) {}
}

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionCommandHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  private readonly logger: Logger = new Logger(
    UpdateTransactionCommandHandler.name,
  );

  constructor(
    @Inject('TransactionRepositoryImplement')
    private readonly repository: TransactionRepository,
    @Inject('ANTIFRAUD_SERVICE')
    private readonly clientKafka: ClientKafka,
  ) {}

  async execute(command: UpdateTransactionCommand): Promise<void> {
    const transaction = await this.repository.findTransaction(
      command.transactionExternalId,
    );

    if (transaction.isErr()) {
      this.logger.error(transaction.error.message);
      throw new InternalServerErrorException(
        transaction.error.message,
        transaction.error.name,
      );
    }

    transaction.value.transactionStatus =
      TransactionStatusEnum[command.transactionStatus];

    const updated = await this.repository.updateTransaction(transaction.value);

    if (updated.isErr()) {
      this.logger.error(updated.error.message);
      throw new InternalServerErrorException(
        updated.error.message,
        updated.error.name,
      );
    }

    const event = new TransactionUpdatedEvent(transaction.value);
    this.clientKafka.emit(event.eventName, event.toString());
    this.logger.log(event.toString());
  }
}
