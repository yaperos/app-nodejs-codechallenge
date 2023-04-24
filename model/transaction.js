const { sequelize, DataTypes } = require('../connection/connection');
const { TransactionStatus } = require('./transaction_status');
const { TranferType } = require('./tranfer_type');

const Transaction = sequelize.define(
  'Transaction',
  {
    transactionExternalId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    accountExternalIdDebit: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    accountExternalIdCredit: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tranferTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    tableName: 'transaction',
    timestamps: false,
  }
);

Transaction.belongsTo(TransactionStatus, {
  foreignKey: 'transactionStatusId'
});

Transaction.belongsTo(TranferType, {
  foreignKey: 'tranferTypeId'
});

module.exports = {
  Transaction
};
