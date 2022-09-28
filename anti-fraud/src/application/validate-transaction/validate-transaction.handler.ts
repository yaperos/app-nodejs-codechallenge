import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransactionFactory } from '../../domain/factory';
import { ValidateTransactionCommand } from './validate-transaction.command';

@CommandHandler(ValidateTransactionCommand)
export class ValidateTransactionHandler implements ICommandHandler<ValidateTransactionCommand> {
  constructor(private readonly transactionFactory: TransactionFactory) {}

  public async execute(command: ValidateTransactionCommand): Promise<void> {
    console.log('ValidateTransactionHandler/execute');
    const account = this.transactionFactory.create(command.id, command.transactionStatus, command.value);
    account.validateValue();
    account.commit();
  }
}
