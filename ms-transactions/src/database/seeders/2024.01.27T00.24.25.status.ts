import { Seeder } from '../dbConfig';

const seedStatus = [
  { id: 1, name: 'pending' },
  { id: 2, name: 'approved' },
  { id: 3, name: 'rejected' }
];
export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert('status', seedStatus);
};
export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .bulkDelete('status', { id: seedStatus.map((u) => u.id) });
};
