import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Transaction } from '../entities/Transaction';
import { TransactionType } from '../entities/TransactionType';
import { TransactionStatus } from '../entities/TransactionStatus';
import { environment } from '../environments';

// Fuente de datos principal para TypeORM y conexión a PostgreSQL.
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: environment.db.host,
  port: environment.db.port,
  username: environment.db.username,
  password: environment.db.password,
  database: environment.db.database,
  synchronize: false,
  logging: false,
  entities: [Transaction, TransactionType, TransactionStatus],
  migrations: [],
  subscribers: [],
});
