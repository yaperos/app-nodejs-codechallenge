import 'dotenv/config';
import { DataSource } from 'typeorm';
import { parse } from 'pg-connection-string';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionType } from 'src/transaction/entities/transaction-type.entity';

const databaseUrl = process.env.DATABASE_URL;
const parsed = parse(databaseUrl || '');

if (!parsed.host || !parsed.user || !parsed.password || !parsed.database) {
  throw new Error('DATABASE_URL is invalid or missing required fields');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: parsed.host,
  port: parseInt(parsed.port || '5432'),
  username: parsed.user,
  password: parsed.password,
  database: parsed.database,
  entities: [Transaction, TransactionType],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
});
