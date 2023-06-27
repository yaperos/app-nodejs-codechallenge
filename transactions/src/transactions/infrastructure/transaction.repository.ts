import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '@transactions/domain/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction) private repository: Repository<Transaction>,
  ) {}

  public async save(transaction: Transaction): Promise<void> {
    await this.repository.save(transaction);
  }

  // TODO: add Redis decorator to cache transaction
  public async findById(externalId: string): Promise<Transaction> {
    return await this.repository.findOne({
      where: { externalId },
    });
  }

  // TODO: adde Redis decorator to invalidate cache
  public async update(
    id: string,
    transaction: Partial<Transaction>,
  ): Promise<void> {
    await this.repository.update(id, transaction);
  }
}
