import { Repository } from 'typeorm';
import { databaseConnection } from '../config/database';
import { Transaction, TransactionStatus } from '../models/transaction.model';

export class TransactionRepository {
  private repository: Repository<Transaction>;

  constructor() {
    this.repository = databaseConnection.getRepository(Transaction);
  }

  async findOneById(id: string): Promise<Transaction> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async insert(data: Transaction): Promise<void> {
    await this.repository.save(data);
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.repository.update(
      {
        id,
      },
      {
        status,
      },
    );
  }
}
