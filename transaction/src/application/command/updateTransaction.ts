import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { TransactionInfrastructure } from '../../infrastructure/transaction.infrastructure';
import { TransactionRepository } from "src/domain/transaction.repository";

export class UpdateTransactionCommand implements ICommand {
  constructor(
    public readonly transactionExternalId: string,
    public readonly status: number,
  ) {}
}
@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionCommandHandler implements ICommandHandler<UpdateTransactionCommand> {
  constructor(
    @Inject(TransactionInfrastructure)
    private repository: TransactionRepository,
  ) {}
  async execute(command: UpdateTransactionCommand): Promise<null> {
    const { transactionExternalId, status } = command;
    
    const transaction = await this.repository.findById(transactionExternalId);
    transaction.update({ status });
    await this.repository.save(transaction);
    
    return Promise.resolve(undefined);
  }
}