import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/ports/transaction.repository';
import Transaction from 'src/domain/transaction';
import { Optional } from 'typescript-optional';
import TransactionCommand from '../commands/transaction.command';
import TransactionFactory from '../factory/transaction.factory';

@Injectable()
export default class CreateTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private transactionRepository: TransactionRepository,
    private transactionFactory: TransactionFactory,
  ) {}

  public handler(
    newTransaction: TransactionCommand,
  ): Promise<Optional<Transaction>> {
    const transaction =
      this.transactionFactory.createTransaction(newTransaction);
    return this.transactionRepository.createTransaction(transaction);
  }
}
