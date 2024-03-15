import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ITransactionCatalogRepository } from '../../../domain/repositories/database/ITransactionCatalogRepository';
import { TransactionCatalogModel } from '../../../domain/model/TransactionCatalog.model';
import { ITransactionCatalogService } from '../ITransactionCatalogService';
import { CatalogTypes } from '../../../domain/enums/CatalogTypes';
import { ICacheRepository } from '../../../domain/repositories/cache/ICacheRepository';
import { TransactionCatalogDTO } from '../../dto/TransactionCatalogDTO';
import { DatabaseTransactionStatus } from '../../../domain/enums/DatabaseTransactionStatus';

@Injectable()
export class TransactionCatalogService implements ITransactionCatalogService {
  constructor(
    private readonly cache: ICacheRepository,
    private readonly repository: ITransactionCatalogRepository,
  ) {}

  async createTransactionCatalog(
    transactionCatalog: TransactionCatalogDTO,
    type: CatalogTypes,
  ): Promise<void> {
    const status: DatabaseTransactionStatus =
      await this.repository.createTransactionCatalog({
        name: transactionCatalog.name,
        type,
      });

    if (status !== DatabaseTransactionStatus.COMPLETED) {
      throw new HttpException(
        `Error creating register with name: ${transactionCatalog.name}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getAllTransactionCatalogByType(
    type: CatalogTypes,
  ): Promise<TransactionCatalogModel[]> {
    return this.repository.getAllTransactionCatalogByType(type);
  }

  async findById(id: number): Promise<TransactionCatalogModel> {
    const cacheCatalog = await this.cache.get(`catalog-${id}`);

    if (cacheCatalog) {
      return cacheCatalog;
    }

    const catalog = await this.repository.findById(id);

    if (catalog) {
      await this.cache.set(`catalog-${id}`, catalog);
    }

    return catalog;
  }

  async findByNameAndType(
    name: string,
    type: string,
  ): Promise<TransactionCatalogModel> {
    const cacheCatalog = await this.cache.get(`${type}-${name}`);

    if (cacheCatalog) {
      return cacheCatalog;
    }

    const catalog = await this.repository.findByNameAndType(name, type);

    if (catalog) {
      await this.cache.set(`${type}-${name}`, catalog);
    }

    return catalog;
  }
}
