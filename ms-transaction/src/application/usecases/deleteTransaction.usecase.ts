import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/ports/transaction.repository';
import Transaction from 'src/domain/transaction';
import { Optional } from 'typescript-optional';

@Injectable()
export default class DeleteTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private transactionRepository: TransactionRepository,
  ) {}

  public handler(transactionId: string): Promise<Optional<Transaction>> {
    return this.transactionRepository.deleteTransaction(transactionId);
  }
}
