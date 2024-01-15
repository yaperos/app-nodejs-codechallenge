import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';
import { TransactionStatus } from './entities/status.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transaction-type.entity';

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
  entities: [Transaction, TransactionStatus, TransactionType],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  seeds: ['apps/transaction/src/database/seeds/**/*{.ts,.js}'],
};

export const dataSource = new DataSource(dbDataSource);
