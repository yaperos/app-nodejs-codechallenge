const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/DatabaseConfig');

class TransferType extends Model {}

TransferType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TransferType',
    tableName: 'transfer_type',
  },
);

module.exports = TransferType;
