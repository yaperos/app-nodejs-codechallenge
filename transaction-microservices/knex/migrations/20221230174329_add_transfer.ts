import { Knex } from 'knex';
import { Transfer } from '../../src/models';

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable(Transfer.tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.timestamps();
    table.string('name');
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable(Transfer.tableName);
