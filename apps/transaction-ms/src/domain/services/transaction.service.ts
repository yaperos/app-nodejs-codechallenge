import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '../model/transaction.model';
import { NotFoundException } from '@nestjs/common';

export class TransactionService {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async getOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findById(id);

    if (!transaction) {
      throw new NotFoundException();
    }
    return transaction;
  }
}
