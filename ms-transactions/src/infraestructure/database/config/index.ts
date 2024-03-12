import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from '../../config';
import { TransactionType } from '../models/transactionType';
import { TransactionStatus } from '../models/transactionStatus';
import { Transactions } from '../models/transactions';

export const DatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: [TransactionType, TransactionStatus, Transactions],
  synchronize: true,
  logging: true,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
};
