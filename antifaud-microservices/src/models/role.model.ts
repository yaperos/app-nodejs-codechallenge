import { Id } from 'objection';
import Base from './base';

export class Role extends Base {
  id!: Id;
  name!: string;

  static tableName = 'roles';

}
