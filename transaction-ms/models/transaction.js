'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init({
    id : {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountExternalIdDebit: {
      type: DataTypes.UUID,
      allowNull: false
    },
    accountExternalIdCredit: {
      type: DataTypes.UUID,
      allowNull: false
    },
    transferTypeId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status:{
      type: DataTypes.ENUM,
      values: ['PENDING', 'APPROVED', 'REJECTED'],
      defaultValue: 'PENDING',
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'transactions',
    modelName: 'transaction',
  });
  return transaction;
};