const { Sequelize } = require('sequelize');

const {
  PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE,
} = process.env;

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: PG_HOST,
  port: PG_PORT,
  username: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  define: {
    timestamps: true,
  },
});

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Error initializing DB for project:', error);
  }
};

module.exports = { sequelize, initializeDB };
