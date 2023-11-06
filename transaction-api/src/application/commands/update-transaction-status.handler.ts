import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionStatusCommand } from './update-transaction-status.command';
import { TransactionRepository } from 'src/domain/repositories';
import { Inject } from '@nestjs/common';

@CommandHandler(UpdateTransactionStatusCommand)
export class UpdateTransactionStatusHandler
  implements ICommandHandler<UpdateTransactionStatusCommand, void>
{
  constructor(
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
  ) {}

  async execute(command: UpdateTransactionStatusCommand): Promise<void> {
    await this.transactionRepository.update(command.transactionId, {
      status: command.status,
    });
  }
}
