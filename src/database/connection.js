const { Sequelize } = require("sequelize");
require("dotenv").config();

const host = process.env.DATABASE_HOST;
const POSTGRES_DB = process.env.POSTGRES_DB;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host,
  dialect: "postgres",
});

module.exports = sequelize;
