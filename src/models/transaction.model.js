const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Transaction = sequelize.define("Transaction", {
  accountExternalIdDebit: DataTypes.STRING,
  accountExternalIdCredit: DataTypes.STRING,
  tranferTypeId: DataTypes.INTEGER,
  value: DataTypes.INTEGER,
  transactionExternalId: DataTypes.STRING,
  transactionType: {
    type: DataTypes.JSONB,
  },
  transactionStatus: {
    type: DataTypes.JSONB,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Transaction;
