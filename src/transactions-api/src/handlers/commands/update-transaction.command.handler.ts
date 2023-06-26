import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from './update-transaction.command';
import { Transaction } from 'src/models/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionCommandHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(
    @InjectRepository(Transaction)
    readonly repository: Repository<Transaction>,
  ) {}

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
