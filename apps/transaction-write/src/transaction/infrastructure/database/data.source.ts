import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';
import { TransactionModel } from './models/transaction.model';
import { TransactionStatusModel } from './models/status.model';
import { TransactionTypeModel } from './models/transaction-type.model';

ConfigModule.forRoot({
  envFilePath: '.env',
});

export const dbDataSource: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: true,
  synchronize: false,
  entities: [TransactionModel, TransactionStatusModel, TransactionTypeModel],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  seeds: [
    'apps/transaction-write/src/transaction/infrastructure/database/seeds/**/*{.ts,.js}',
  ],
};

export const dataSource = new DataSource(dbDataSource);
