import { Inject } from '@nestjs/common';
import { Transaction } from '../../domain/Transaction';
import { TransactionRepository } from '../../domain/TransactionRepository';
import { DepositCommand } from './DepositCommand';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TRANSACTION_REPOSITORY } from '../../token_repository.di';
import { TransactionModel } from '@transaction/src/contexts/transaction-finance/domain/models/transaction.model';
import { ClientKafka } from '@nestjs/microservices';
import { IS_VALID_TRANSACTION_MESSAGE_PATTERN } from 'utils/utils/constants-global';

@CommandHandler(DepositCommand)
export class DepositCommandHandler implements ICommandHandler<DepositCommand> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    @Inject('ANTI_FRAUD_CLIENT')
    private readonly emitEvent: ClientKafka,
  ) {}

  async execute({
    accountExternalIdDebit,
    accountExternalIdCredit,
    tranferTypeId,
    value,
  }: DepositCommand): Promise<Partial<TransactionModel>> {
    const deposit = new Transaction(
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    );
    const createdDeposit = await this.transactionRepository.create(deposit);
    this.emitEvent.emit(
      IS_VALID_TRANSACTION_MESSAGE_PATTERN,
      JSON.stringify({
        accountExternalId: createdDeposit.transactionExternalId,
        value: createdDeposit.value,
      }),
    );
    return createdDeposit;
  }
}
