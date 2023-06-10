import { TransactionRepositoryInterface } from '../../../domain/repository/transaction.repository.interface';
import { TransactionTable } from '../tables/transaction.table';

import { TransactionEntityDto } from '../../../domain/dtos/entities/transaction-entity.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionRepository implements TransactionRepositoryInterface {
  constructor(
    @InjectRepository(TransactionTable)
    private repository: Repository<TransactionTable>,
  ) {}

  async create(
    transaction: TransactionEntityDto,
  ): Promise<TransactionEntityDto> {
    return this.repository.save(transaction);
  }

  async findOne(externalId: string): Promise<TransactionEntityDto> {
    return this.repository.findOne({
      where: { transactionExternalId: externalId },
    });
  }

  async updateById(id: string, data: unknown) {
    await this.repository
      .createQueryBuilder()
      .update(TransactionTable)
      .set(data)
      .where('transactionExternalId = :id', { id })
      .execute();
  }
}
