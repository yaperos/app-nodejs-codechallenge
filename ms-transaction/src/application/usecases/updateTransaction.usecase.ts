import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../domain/ports/transaction.repository';
import Transaction from '../../domain/transaction';
import { Optional } from 'typescript-optional';
import { UpdateTransactionDTO } from '../dtos/updateTransaction.dto';

@Injectable()
export default class UpdateTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private transactionRepository: TransactionRepository,
  ) {}

  public handler(
    transactionId: string,
    newTransaction: UpdateTransactionDTO,
  ): Promise<Optional<Transaction>> {
    const updateTransaction = new Transaction({
      transactionId,
      accountExternalIdDebit: newTransaction.accountExternalIdDebit,
      accountExternalIdCredit: newTransaction.accountExternalIdCredit,
      tranferTypeId: newTransaction.tranferTypeId,
      value: newTransaction.value,
      status: newTransaction.status,
    });
    return this.transactionRepository.updateTransaction(
      transactionId,
      updateTransaction,
    );
  }
}
