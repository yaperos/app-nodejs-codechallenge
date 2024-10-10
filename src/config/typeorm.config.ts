import { DataSource } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';

export function createDataSource(): DataSource {
  return new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [Transaction],
    synchronize: true,
    logging: false,
  });
}
