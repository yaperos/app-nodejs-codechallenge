import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../../modules/transaction';
import { environment } from '../environment';

export function databaseConfig(): TypeOrmModuleOptions {
  const dbConfig = environment.databaseConfig;

  return {
    type: 'postgres',
    ...dbConfig,
    entities: [Transaction, TransactionStatus, TransactionType],
    synchronize: true,
    logging: false,
  };
}
