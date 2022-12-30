import { Knex } from 'knex';
import { Transfer } from '../../src/models';

const now = new Date();

const transfers = [
  {
    id: 1,
    name: 'National transfers',
  },
  {
    id: 2,
    name: 'International transfers',
  }
];

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Transfer.tableName).del();
  await knex(Transfer.tableName).insert(transfers);
};
