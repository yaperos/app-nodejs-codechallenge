import { DataSource } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';

export function createDataSource(): DataSource {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Transaction],
    synchronize: true,
    logging: false,
  });
}
