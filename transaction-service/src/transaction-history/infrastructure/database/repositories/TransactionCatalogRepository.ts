import { ITransactionCatalogRepository } from '../../../domain/repositories/database/ITransactionCatalogRepository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionCatalogEntity } from '../entities/TransactionCatalog.entity';
import { TransactionCatalogModel } from '../../../domain/model/TransactionCatalog.model';
import { CatalogTypes } from '../../../domain/enums/CatalogTypes';
import { DatabaseTransactionStatus } from '../../../domain/enums/DatabaseTransactionStatus';

@Injectable()
export class TransactionCatalogRepository
  implements ITransactionCatalogRepository
{
  constructor(@Inject(DataSource) private dataSource: DataSource) {}

  async createTransactionCatalog(
    transactionType: TransactionCatalogModel,
  ): Promise<DatabaseTransactionStatus> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(TransactionCatalogEntity)
        .values(transactionType)
        .execute();
      await queryRunner.commitTransaction();

      return DatabaseTransactionStatus.COMPLETED;
    } catch (err) {
      Logger.error('Error creating new transaction catalog', err.message);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return DatabaseTransactionStatus.REJECTED;
  }

  async getAllTransactionCatalogByType(
    type: CatalogTypes,
  ): Promise<TransactionCatalogModel[]> {
    try {
      return this.dataSource
        .getRepository(TransactionCatalogEntity)
        .createQueryBuilder('transaction_catalog')
        .select(['transaction_catalog.name'])
        .where('transaction_catalog.type = :type', { type })
        .getMany();
    } catch (err) {
      Logger.error('Error getting all transaction catalog', err.message);
    }

    return [];
  }

  findById(id: number): Promise<TransactionCatalogModel> {
    try {
      return this.dataSource
        .getRepository(TransactionCatalogEntity)
        .createQueryBuilder('transaction_catalog')
        .select()
        .where('transaction_catalog.id = :id', { id })
        .getOne();
    } catch (err) {
      Logger.error('Error getting transaction catalog by id', err.message);
    }

    return new Promise(() => {});
  }

  findByNameAndType(
    name: string,
    type: string,
  ): Promise<TransactionCatalogModel> {
    try {
      return this.dataSource
        .getRepository(TransactionCatalogEntity)
        .createQueryBuilder('transaction_catalog')
        .select()
        .where('transaction_catalog.type = :type', { type })
        .andWhere('transaction_catalog.name = :name', { name })
        .getOne();
    } catch (err) {
      Logger.error(
        'Error getting transaction catalog by name and type',
        err.message,
      );
    }

    return new Promise(() => {});
  }
}
