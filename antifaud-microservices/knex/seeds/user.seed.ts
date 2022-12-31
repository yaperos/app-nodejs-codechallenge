import { Knex } from 'knex';
import { Role, User } from '../../src/models';

const now = new Date();

const users = [
  {
    id: 1,
    name: 'Administrator',
    email: 'admin@yopmail.com',
    password: 'password',
    role_id: 1,
    createdAt: now,
    updatedAt: now,
  }
];

export const seed = async (knex: Knex): Promise<void> => {
  await knex(User.tableName).del();
  await knex(User.tableName).insert(users);
};
