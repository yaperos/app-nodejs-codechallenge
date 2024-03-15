import { TransactionCatalogModel } from '../../domain/model/TransactionCatalog.model';
import { CatalogTypes } from '../../domain/enums/CatalogTypes';
import { TransactionCatalogDTO } from '../dto/TransactionCatalogDTO';

export abstract class ITransactionCatalogService {
  abstract createTransactionCatalog(
    transactionType: TransactionCatalogDTO,
    type: CatalogTypes,
  ): Promise<void>;

  abstract getAllTransactionCatalogByType(
    type: CatalogTypes,
  ): Promise<TransactionCatalogModel[]>;

  abstract findById(id: number): Promise<TransactionCatalogModel>;

  abstract findByNameAndType(
    name: string,
    type: string,
  ): Promise<TransactionCatalogModel>;
}
