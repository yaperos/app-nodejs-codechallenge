const { sequelize, DataTypes } = require('../connection/connection');

const TranferType = sequelize.define(
  'TranferType',
  {
    tranferTypeId: {
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
    tableName: 'tranfer_type',
    timestamps: false,
  }
);

module.exports = {
  TranferType
};
