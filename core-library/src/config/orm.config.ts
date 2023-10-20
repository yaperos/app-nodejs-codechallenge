import { Transaction } from '../../../transactions/src/domain/model/transaction.model';
import { TransactionMigration1697597319014 } from '../../../transactions/src/schema/1697597319014-TransactionMigration';

import { DataSourceOptions } from 'typeorm';

const DEFAULT_MAX_POOL_SIZE = 15;
const DEFAULT_PORT = 5432;

const OrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.db_postgres_db_host,
  port: parseInt(process.env.db_postgres_db_port, 10) || DEFAULT_PORT,
  username: process.env.db_postgres_db_user || 'postgres',
  password: process.env.db_postgres_db_password || 'postgres',
  database: process.env.db_postgres_db_name || 'yape_code_challenge',
  connectTimeoutMS: 4000,
  entities: [Transaction],
  synchronize: false,
  migrationsRun: true,
  logging: false,
  extra: {
    idleTimeoutMillis: 60000,
    query_timeout: 60000,
    connectionTimeoutMillis: 4000,
    max: parseInt(process.env.MAX_POOL_SIZE, 10) || DEFAULT_MAX_POOL_SIZE
  },
  migrations: [
    TransactionMigration1697597319014
  ]
};

export = OrmConfig;