import { Inject, Injectable } from '@nestjs/common';
import { ApplicationService } from '../domain/interfaces/application-service';
import { Transaction } from '../domain/entities/transaction';
import { TRANSACTION_REPOSITORY } from '../infrastructure/constants/injection-tokens';
import { ICreateTransaction } from '../domain/interfaces/create-transaction';
import { ITransactionRepository } from '../domain/interfaces/transaction-repository';

@Injectable()
export class CreateTransaction implements ApplicationService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  public async process(command: ICreateTransaction): Promise<Transaction> {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    } = command;
    const transactionExist =
      await this.transactionRepository.findByaccountExternalIdDebit(
        accountExternalIdDebit,
      );
    if (transactionExist) {
      return transactionExist;
    }

    const transaction = new Transaction(
      this.transactionRepository.nextId(),
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    );
    await this.transactionRepository.persist(transaction);

    return transaction;
  }
}
