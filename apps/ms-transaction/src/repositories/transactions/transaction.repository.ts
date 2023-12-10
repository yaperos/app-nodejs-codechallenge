import { InjectEntityManager } from '@nestjs/typeorm';
import { TransactionRepositoryContract } from './transaction.repository.contract';
import { EntityManager, Repository } from 'typeorm';
import { Transaction, TransactionSchema } from '@app/common';

export class TransactionRepository implements TransactionRepositoryContract {
  private readonly repository: Repository<Transaction>;

  constructor(@InjectEntityManager() private readonly manager: EntityManager) {
    this.repository = this.manager.getRepository(TransactionSchema);
  }

  async findById(id: string): Promise<Transaction> {
    return this.repository.findOne({
      where: { transactionExternalId: id },
      relations: { transactionType: true },
    });
  }
  async findAll(take?: number, skip?: number): Promise<Transaction[]> {
    return this.repository.find({
      take,
      skip,
      relations: { transactionType: true },
    });
  }
  async save(transaction: Transaction): Promise<Transaction> {
    return this.repository.save(transaction);
  }
}
