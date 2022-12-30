import { Knex } from 'knex';
import { Role } from '../../src/models';

const now = new Date();

const roles = [
  {
    id: 1,
    name: 'Admin',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: 'Owner',
    createdAt: now,
    updatedAt: now,
  }
];

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Role.tableName).del();
  await knex(Role.tableName).insert(roles);
};
