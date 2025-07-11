import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT ? Number(process.env.PORT) : 3001,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'ms-transactions',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    groupId: process.env.KAFKA_GROUP_ID || 'ms-transactions-group',
  },
}));
