import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

export class AfterUpdateTransactionCommand implements ICommand {
  constructor(readonly message: string) {}
}

@CommandHandler(AfterUpdateTransactionCommand)
export class AfterUpdateTransactionCommandHandler
  implements ICommandHandler<AfterUpdateTransactionCommand>
{
  private readonly logger: Logger = new Logger(
    AfterUpdateTransactionCommandHandler.name,
  );

  constructor(
    @Inject('DocumentTransactionRepository')
    private readonly repository: TransactionRepository,
  ) {}

  async execute(command: AfterUpdateTransactionCommand): Promise<void> {
    const transaction = TransactionEntity.createFromString(command.message);
    const updated = await this.repository.updateTransaction(transaction);

    if (updated.isErr()) {
      this.logger.error(updated.error.message);
      throw updated.error;
    }
  }
}
