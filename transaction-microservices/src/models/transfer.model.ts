import { Id, RelationMappings } from 'objection';
import Base from './base';
import { Model } from 'objection';

export class Transfer extends Base {
  id!: Id;
  name!: string;

  static tableName = 'transfer';
}
