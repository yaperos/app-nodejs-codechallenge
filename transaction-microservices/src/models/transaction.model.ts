import { Id, RelationMappings } from 'objection';
import Base from './base';

export class Transaction extends Base {
  id!: Id;
  transactionExternalId!: string;
  accountExternalIdDebit!: string;
  accountExternalIdCredit!: string;
  tranferTypeId!: number;
  value!: number;
  status!: string;
  createdAt!: string;
  updatedAt!: string;
  
  static tableName = 'transactions';
  
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }
}
