import { Inject } from '@nestjs/common';
import { TransactionRepository } from '../../domain/TransactionRepository';
import { ChangeStatusCommand } from './ChangeStatusCommand';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TRANSACTION_REPOSITORY } from '../../token_repository.di';
import { TransactionModel } from '@transaction/src/contexts/transaction-finance/domain/models/transaction.model';

@CommandHandler(ChangeStatusCommand)
export class ChangeStatusCommandHandler
  implements ICommandHandler<ChangeStatusCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute({
    accountExternalId,
    transactionStatus,
  }: ChangeStatusCommand): Promise<Partial<TransactionModel>> {
    const createdDeposit = await this.transactionRepository.update(
      accountExternalId,
      transactionStatus,
    );
    return createdDeposit;
  }
}
