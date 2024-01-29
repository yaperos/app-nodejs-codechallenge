import { DataTypes } from 'sequelize';
import { Migration } from '../dbConfig';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('types', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('types');
};
