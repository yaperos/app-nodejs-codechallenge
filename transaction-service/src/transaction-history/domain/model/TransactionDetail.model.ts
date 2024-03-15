import { TransactionCatalogModel } from './TransactionCatalog.model';

export class TransactionDetailModel {
  readonly transactionExternalId: string;
  readonly transactionType: TransactionCatalogModel;
  readonly transactionStatus: TransactionCatalogModel;
  readonly value: number;
  readonly createdAt: string;
}
