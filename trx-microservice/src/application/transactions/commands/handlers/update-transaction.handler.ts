import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from '../update-transaction.command';
import { Inject } from '@nestjs/common';
import { TransactionRepository } from '../../../../domain/transactions/transaction.repository';
import { TRANSACTION_STATUS } from 'src/domain/transactions/transaction';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionStatusHandler
  implements ICommandHandler<UpdateTransactionCommand, void>
{
  constructor(
    @Inject(TransactionRepository) private readonly trxRepo: TransactionRepository,
  ) {}

  async execute(cmd: UpdateTransactionCommand): Promise<void> {    
    await this.trxRepo.updateStatus(cmd.transactionExternalId, cmd.status as TRANSACTION_STATUS);
  }
}