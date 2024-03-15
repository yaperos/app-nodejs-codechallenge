import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from 'dotenv';

config();

export const connectionOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  migrationsRun: false,
  migrations: [
    'src/transaction-history/infrastructure/database/migrations/*.ts',
  ],
  entities: [
    'src/transaction-history/infrastructure/database/entities/*.entity.ts',
  ],
  logging: process.env.NODE_ENV === 'development',
  uuidExtension: 'uuid-ossp',
};
export default new DataSource(connectionOptions);
