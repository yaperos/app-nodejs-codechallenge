import { Seeder } from '../dbConfig';

const seedTypes = [
  { id: 1, name: 'incoming' },
  { id: 2, name: 'outcoming' }
];
export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert('types', seedTypes);
};
export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .bulkDelete('types', { id: seedTypes.map((u) => u.id) });
};
