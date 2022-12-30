import { Knex } from 'knex';
import { User } from '../../src/models';

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable(User.tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.timestamps();
    table.string('name').notNullable();
    table.string('email');
    table.string('password');
    table.integer('role_id').notNullable();
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable(User.tableName);
