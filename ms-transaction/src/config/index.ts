import 'dotenv/config';

export const ConfigEnv = {
  serviceTag: process.env.SERVICE_TAG || 'ms-transaction',
  port: process.env.PORT || 4000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'transaction_status',
  },
  generateError: process.env.GENERATE_ERROR === 'true',
  probabilityOfError: parseFloat(process.env.PROBABILITY_OF_ERROR) || 0.01,
};
