import { CatalogTypes } from '../enums/CatalogTypes';

export class TransactionCatalogModel {
  readonly id?: number;
  readonly name: string;
  readonly type: CatalogTypes;
}
