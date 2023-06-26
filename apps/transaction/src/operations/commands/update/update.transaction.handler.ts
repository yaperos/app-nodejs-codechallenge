import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {UpdateTransactionCommand} from './update.transaction.command';
import {Transaction} from '../../../transaction/transaction.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionCommandHandler
  implements ICommandHandler<UpdateTransactionCommand, Transaction>
{
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async execute(command: UpdateTransactionCommand): Promise<Transaction> {
    const {transactionExternalId, status} = command;
    const transaction = await this.transactionRepository.findOne({
      where: {transactionExternalId},
    });

    transaction.status = status;
    return await this.transactionRepository.save(transaction);
  }
}
