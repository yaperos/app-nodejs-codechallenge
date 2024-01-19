import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TransactionOutput } from '../dtos/transaction.output';
import { TransactionCreator } from '../use-cases/transaction-creator.use-case';
import { CreateTransactionCommand } from './create-transaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(private transactionCreator: TransactionCreator) {}

  async execute(command: CreateTransactionCommand): Promise<TransactionOutput> {
    const transaction = await this.transactionCreator.run(
      command.getId(),
      command.getCreditAccountExternalId(),
      command.getDebitAccountExternalId(),
      command.getAmount(),
      command.getTransferType(),
    );

    return TransactionOutput.fromTransaction(transaction);
  }
}
