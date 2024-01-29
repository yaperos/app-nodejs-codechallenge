const { DataSource } = require('typeorm');

const { Transaction } = require('./entity/transaction');
const { TransferType } = require('./entity/transferType');
const { ConfigEnv } = require('../../config');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: ConfigEnv.db.host,
  port: parseInt(ConfigEnv.db.port, 10),
  username: ConfigEnv.db.username,
  password: ConfigEnv.db.password,
  database: ConfigEnv.db.database,
  entities: [
    Transaction,
    TransferType,
  ],
  synchronize: false,
  logging: false,
});

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization:', err);
  }
};

module.exports = {
  AppDataSource,
  initializeDatabase,
};
