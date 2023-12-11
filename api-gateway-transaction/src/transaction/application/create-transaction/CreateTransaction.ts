import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/transaction/domain/TransactionRepository';
import { CreateTransactionRequest } from './CreateTransactionRequest';
import { Transaction } from 'src/transaction/domain/Transaction';

@Injectable()
export class CreateTransaction {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(request: CreateTransactionRequest) {
    const transaction = Transaction.create(request);
    await this.repository.create(transaction);
  }
}
