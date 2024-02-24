import { Transaction } from 'src/domain/entity/transaction.entity';
import { CreateTables1708540209435 } from 'src/schema/migration/1708540209435-createTables';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const OrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.db_postgres_db_host,
  port: parseInt(process.env.db_postgres_db_port),
  username: process.env.db_postgres_db_user,
  password: process.env.db_postgres_db_password,
  database: process.env.db_postgres_db_name,
  entities: [Transaction],
  synchronize: false,
  migrationsRun: true,
  logging: false,
  migrations: [
    CreateTables1708540209435
  ]
};

export default OrmConfig;