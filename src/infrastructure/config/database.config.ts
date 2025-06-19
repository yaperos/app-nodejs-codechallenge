import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TransactionOrmEntity } from '../adapters/persistence/entities/transaction.entity';
import { TransactionTypeOrmEntity } from '../adapters/persistence/entities/transaction-type.entity';
import { TransactionStatusOrmEntity } from '../adapters/persistence/entities/transaction-status.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'yape_challenge',
  entities: [
    TransactionOrmEntity,
    TransactionTypeOrmEntity,
    TransactionStatusOrmEntity,
  ],
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  maxQueryExecutionTime: 1000,
  extra: {
    connectionLimit: 10,
  },
}; 