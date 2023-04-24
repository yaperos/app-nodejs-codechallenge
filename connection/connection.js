const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_URL
);

module.exports.sequelize = sequelize;
module.exports.DataTypes = DataTypes;
