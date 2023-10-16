const transactionConfig = (isCli = false) => ({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_TRANSACTIONS_USERNAME,
  password: process.env.TYPEORM_TRANSACTIONS_PASSWORD,
  database: process.env.TYPEORM_TRANSACTIONS_DATABASE,
  synchronize: process.env.SYNCHRONIZE_MIGRATIONS === 'true' ? true : false,
  logging: process.env.NODE_ENV === 'development' ? true : false,
  entities: [
    isCli
      ? 'apps/transaction-service/src/database/**/*.entity.ts'
      : 'dist/apps/transaction-service/src/database/**/*.entity.js',
  ],
  migrations: [
    isCli
      ? 'apps/transaction-service/src/database/migrations/*.ts'
      : 'dist/apps/transaction-service/src/database/migrations/*.ts',
  ],
  ssl: false,
  extra: {},
});

module.exports = {
  transactionConfig,
};
