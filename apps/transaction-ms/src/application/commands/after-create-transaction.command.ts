import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

export class AfterCreateTransactionCommand implements ICommand {
  constructor(readonly message: string) {}
}

@CommandHandler(AfterCreateTransactionCommand)
export class AfterCreateTransactionCommandHandler
  implements ICommandHandler<AfterCreateTransactionCommand>
{
  private readonly logger: Logger = new Logger(
    AfterCreateTransactionCommandHandler.name,
  );

  constructor(
    @Inject('DocumentTransactionRepository')
    private readonly repository: TransactionRepository,
  ) {}

  async execute(command: AfterCreateTransactionCommand): Promise<void> {
    const transaction = TransactionEntity.createFromString(command.message);
    const created = await this.repository.createTransaction(transaction);

    if (created.isErr()) {
      this.logger.error(created.error.message);
      throw created.error;
    }
  }
}
