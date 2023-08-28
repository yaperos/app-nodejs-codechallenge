const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/DatabaseConfig');
const { statusTypes } = require('../utils/transactionConstants');
const TransferType = require('./TransferType');

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(statusTypes)),
      allowNull: false,
      defaultValue: statusTypes.PENDING,
    },
    accountExternalIdDebit: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    accountExternalIdCredit: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    transferTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transaction',
  },
);

Transaction.belongsTo(TransferType, {
  foreignKey: 'transferTypeId',
  as: 'transferType',
});

module.exports = Transaction;
