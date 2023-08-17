import { QueryRunner } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { BaseDB } from '../../shared/repository/BaseDB';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CreateTransferRepository extends BaseDB {
  queryRunner: QueryRunner;
  constructor() {
    super();
  }

  async start() {
    this.queryRunner = this.getDataSource().createQueryRunner();
    await this.queryRunner.startTransaction();
  }

  async create(data: Partial<Transaction>) {
    return await this.queryRunner.manager.save(Transaction, data, {
      reload: true,
    });
  }

  async commitTransaction() {
    await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction() {
    await this.queryRunner.rollbackTransaction();
  }

  async release() {
    await this.queryRunner.release();
  }
}
