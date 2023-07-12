import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/ports/transaction.repository';
import Transaction from 'src/domain/transaction';

@Injectable()
export default class GetAllTransactionsUseCase {
  constructor(
    @Inject('TransactionRepository')
    private transactionRepository: TransactionRepository,
  ) {}

  public handler(): Promise<Transaction[]> {
    return this.transactionRepository.getAllTransactions();
  }
}
