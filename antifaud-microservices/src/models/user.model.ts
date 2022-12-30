import { Id, RelationMappings } from 'objection';
import Base from './base';
import { Model } from 'objection';
import { Role } from './role.model';

export class User extends Base {
  id!: Id;
  name!: string;
  email!: string;
  password!: string;
  role_id!: number;

  static tableName = 'users';

  static get relationMappings(): RelationMappings {
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'users.role_id',
          to: 'roles.id'
        }
      }
    };
  }
}
