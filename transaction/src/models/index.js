const { Sequelize } = require('sequelize');
require('dotenv').config()
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});
const models = {
  Transaction: require('./transaction')(sequelize, Sequelize.DataTypes),
};

module.exports = {sequelize, models};
