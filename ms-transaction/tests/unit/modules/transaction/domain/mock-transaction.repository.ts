import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/modules/transaction/domain/transaction';
import { TransactionRepository } from 'src/modules/transaction/domain/transaction.repository';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';
import { Transactions } from 'src/modules/transaction/domain/transactions';

@Injectable()
export class MockTransactionRepository implements TransactionRepository {
  private mockCreateTransaction = jest.fn();
  private mockUpdateTransaction = jest.fn();
  private mockFindOneTransactionBy = jest.fn();
  private mockFindTransactionsBy = jest.fn();
  private mockCountTransactions = jest.fn();

  private transaction: Transaction;
  private transactions: Transactions;
  private transactionsCounter: number;

  async createTransaction(transaction: Transaction): Promise<void> {
    this.mockCreateTransaction(transaction);
  }

  assertCreateTransactionHasBeenCalledWith(transaction: Transaction) {
    expect(this.mockCreateTransaction).toHaveBeenCalledWith(transaction);
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    this.mockUpdateTransaction(transaction);
  }

  assertUpdateTransactionHasBeenCalledWith(transaction: Transaction) {
    expect(this.mockUpdateTransaction).toHaveBeenCalledWith(transaction);
  }

  assertNotUpdateTransactionCalled() {
    expect(this.mockUpdateTransaction).toHaveBeenCalledTimes(0);
  }

  returnOnFindOneTransactionBy(transaction: Transaction) {
    this.transaction = transaction;
  }

  async findOneTransactionBy(
    transactionCriteria: TransactionCriteria,
  ): Promise<Transaction> {
    this.mockFindOneTransactionBy(transactionCriteria);
    return this.transaction;
  }

  assertFindOneTransactionByHasBeenCalledWith(
    transactionCriteria: TransactionCriteria,
  ) {
    expect(this.mockFindOneTransactionBy).toHaveBeenCalledWith(
      transactionCriteria,
    );
  }

  returnOnFindTransactionsBy(transactions: Transactions) {
    this.transactions = transactions;
  }

  async findTransactionsBy(
    transactionCriteria: TransactionCriteria,
  ): Promise<Transactions> {
    this.mockFindTransactionsBy(transactionCriteria);
    return this.transactions;
  }

  assertFindTransactionsByHasBeenCalledWith(
    transactionCriteria: TransactionCriteria,
  ) {
    expect(this.mockFindTransactionsBy).toHaveBeenCalledWith(
      transactionCriteria,
    );
  }

  returnOnCountTransactions(transactionsCounter: number) {
    this.transactionsCounter = transactionsCounter;
  }

  async countTransactions(
    transactionCriteria: TransactionCriteria,
  ): Promise<number> {
    this.mockCountTransactions(transactionCriteria);
    return this.transactionsCounter;
  }

  assertCountTransactionsHasBeenCalledWith(
    transactionCriteria: TransactionCriteria,
  ) {
    expect(this.mockCountTransactions).toHaveBeenCalledWith(
      transactionCriteria,
    );
  }
}
