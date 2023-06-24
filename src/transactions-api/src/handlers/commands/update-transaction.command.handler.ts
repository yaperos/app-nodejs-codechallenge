import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from './update-transaction.command';
import { Transaction } from 'src/models/transaction.entity';
import { Repository } from 'typeorm';

@CommandHandler(UpdateTransactionHandler)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(readonly repository: Repository<Transaction>) {}

  async execute(command: UpdateTransactionCommand): Promise<void> {
    try {
      const transaction = await this.repository.findOne({
        where: { id: command.transctionId },
      });
      transaction.status = command.transactionStatus;
      await this.repository.save(transaction);
    } catch (error) {
      throw error;
    }
  }
}
