import { DataSource } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../entities/index';

import { seedTransactionTables1676435849319 } from '../migrations/1676435849319-seedTransactionTables';
export const connectionSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  logging: true,
  synchronize: true,
  name: 'default',
  entities: [Transaction, TransactionStatus, TransactionType],
  migrations: [seedTransactionTables1676435849319],
});
