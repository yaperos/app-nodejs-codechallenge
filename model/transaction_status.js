const { sequelize, DataTypes } = require('../connection/connection');


const TransactionStatus = sequelize.define(
  'TransactionStatus',
  {
    transactionStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    tableName: 'transaction_status',
    timestamps: false,
  }
);

module.exports = {
  TransactionStatus
};
