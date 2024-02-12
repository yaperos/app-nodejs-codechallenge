import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '../model/transaction.model';

export class TransactionService {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async getById(id: string): Promise<Transaction> {
    return this.transactionRepo.findById(id);
  }
}
