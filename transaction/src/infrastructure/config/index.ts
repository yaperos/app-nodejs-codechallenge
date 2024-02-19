import * as dotenv from 'dotenv';

dotenv.config();

export const configuration = {
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.NODE_ENV === 'dev',
  },
  kafka: {
    client: 'transaction-app',
    broker: process.env.KAFKA_HOST,
  },
};
