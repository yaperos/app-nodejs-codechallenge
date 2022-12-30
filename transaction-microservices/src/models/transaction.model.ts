import { Id, RelationMappings } from 'objection';
import Base from './base';
import { Model } from 'objection';

export class Transaction extends Base {
  id!: Id;
  transactionExternalId!: string;
  accountExternalIdDebit!: string;
  accountExternalIdCredit!: string;
  tranferTypeId!: number;
  value!: number;
  status!: string;

  static tableName = 'transactions';
}
