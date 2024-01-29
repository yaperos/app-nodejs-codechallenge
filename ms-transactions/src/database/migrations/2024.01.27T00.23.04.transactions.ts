import { Migration } from '../dbConfig';
import { DataType } from 'sequelize-typescript';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('transactions', {
    transactionExternalId: {
      type: DataType.UUID,
      allowNull: false,
      defaultValue: DataType.UUID,
      primaryKey: true
    },
    accountExternalIdDebit: {
      type: DataType.UUID,
      allowNull: false
    },
    accountExternalIdCredit: {
      type: DataType.UUID,
      allowNull: false
    },
    typeId: {
      type: DataType.INTEGER,
      allowNull: false
    },
    statusId: {
      type: DataType.INTEGER,
      allowNull: false
    },
    value: {
      type: DataType.DOUBLE,
      allowNull: false
    },
    createdAt: {
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW
    },
    updatedAt: {
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW
    }
  });
};
export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('transactions');
};
