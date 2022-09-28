
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { tranferTypeIdObject } from 'src/domain/transaction.tranfer.type.id';
import { TransactionFactory } from '../../domain/factory';
import { TransactionRepository } from '../../domain/repository';
import { STATUS_TYPE } from '../../domain/transaction';
import { InjectionToken } from '../injection.token';
import { CreateTransactionCommand } from './create-transaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(
    @Inject(InjectionToken.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionFactory: TransactionFactory,
  ) {}

  public async execute(command: CreateTransactionCommand) {
    console.log('Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]');

    const tranferTypeId = new tranferTypeIdObject(command.tranferTypeId)
    tranferTypeId.validate();
    const account = this.transactionFactory.create(
      await this.transactionRepository.newId(),
      STATUS_TYPE.pending,
      command.accountExternalIdDebit,
      command.accountExternalIdCredit,
      command.tranferTypeId,
      command.value,
    );
    account.openAccount();
    const response = await this.transactionRepository.saveInfo(account);
    account.commit();
    return response;
  }
}
