import { TransactionCatalogModel } from '../../model/TransactionCatalog.model';
import { DatabaseTransactionStatus } from '../../enums/DatabaseTransactionStatus';

export abstract class ITransactionCatalogRepository {
  abstract createTransactionCatalog(
    transactionType: TransactionCatalogModel,
  ): Promise<DatabaseTransactionStatus>;

  abstract getAllTransactionCatalogByType(
    type: string,
  ): Promise<TransactionCatalogModel[]>;

  abstract findById(id: number): Promise<TransactionCatalogModel>;

  abstract findByNameAndType(
    name: string,
    type: string,
  ): Promise<TransactionCatalogModel>;
}
