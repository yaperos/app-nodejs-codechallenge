import { Repository, UpdateResult } from 'typeorm';
import { TransactionsEntity } from '../entities/transactions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DataUpdateTransactionDTO } from 'src/transactions/transactions.dto';

@Injectable()
export class TransactionRespository extends Repository<TransactionsEntity> {
  constructor(
    @InjectRepository(TransactionsEntity) repo: Repository<TransactionsEntity>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async list(): Promise<TransactionsEntity[]> {
    return this.createQueryBuilder('transactions').getMany();
  }

  async update(
    transaction_id: number,
    update: DataUpdateTransactionDTO,
  ): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(TransactionsEntity)
      .set(update)
      .where('id = :id', { transaction_id })
      .execute();
  }
}
