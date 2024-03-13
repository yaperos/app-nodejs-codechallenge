import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../../../.env'),
});

export const serverConfig = {
  port: Number(process.env.PORT_MS_TRANSACTIONS) || 3000,
  name: process.env.NAME_MS_TRANSACTIONS,
};

export const kafkaConfig = {
  broker: process.env.KAFKA_BROKER,
};

export const msConfig = {
  nameLogger: process.env.NAME_MS_LOGGER,
  nameTransactions: process.env.NAME_MS_TRANSACTIONS,
  nameAntiFraud: process.env.NAME_MS_ANTI_FRAUD,
};

export const databaseConfig = {
  host: process.env.DATBASE_TRANSACTIONS_HOST,
  port: Number(process.env.DATBASE_TRANSACTIONS_PORT) || 5432,
  username: process.env.DATBASE_TRANSACTIONS_USERNAME,
  password: process.env.DATBASE_TRANSACTIONS_PASSWORD,
  database: process.env.DATBASE_TRANSACTIONS_DATABASE,
};
