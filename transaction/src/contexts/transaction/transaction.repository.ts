import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Transaction } from '@/contexts/transaction/entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectDataSource('DB_SERVER_POSTGRES')
    private dataSource: DataSource,
  ) {}

  async insertData(transaction: Transaction) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transactionResp = await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();
      return transactionResp;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async updateData(transactionId, status) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transactionResp = await queryRunner.manager
        .update(Transaction,{transaction_id: transactionId },{transaction_status: status})
      await queryRunner.commitTransaction();
      return transactionResp;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async findData(id) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      return await queryRunner.manager
        .findBy(Transaction, { account_external_id_debit: id });
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

