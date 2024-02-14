import { Repository } from 'typeorm';
import { databaseConnection } from '../config/database';
import { Transaction } from '../models/transaction.model';

export class TransactionRepository {
  private transactionRepository: Repository<Transaction>;

  constructor() {
    this.transactionRepository = databaseConnection.getRepository(Transaction);
  }

  async findOne(id: string): Promise<Transaction> {
    return await this.transactionRepository.findOne({
      where: { id },
    });
  }

  async insert(data: Transaction) {
    return await this.transactionRepository.save(data);
  }
}
