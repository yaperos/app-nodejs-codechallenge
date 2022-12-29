import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { TransactionInfrastructure } from '../../infrastructure/transaction.infrastructure';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

export class UpdateTransactionCommand implements ICommand {
  constructor(
    public readonly transactionExternalId: string,
    public readonly status: number,
  ) {}
}
@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionCommandHandler
  implements ICommandHandler<UpdateTransactionCommand, null>
{
  constructor(
    @Inject(TransactionInfrastructure)
    private repository: TransactionRepository,
  ) {}
  async execute(command: UpdateTransactionCommand): Promise<null> {
    console.log(command, 'UpdateTransactionCommandHandler');
    const { transactionExternalId, status } = command;
    const transaction = await this.repository.findById(transactionExternalId);
    transaction.update({ status });
    await this.repository.save(transaction);
    return Promise.resolve(undefined);
  }
}
