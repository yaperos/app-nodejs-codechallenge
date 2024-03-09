import { TransactionStatus } from "src/transaction-status/transaction-status.entity";
import { TransactionType } from "src/transaction-type/transaction-type/transaction-type.entity";
import { Transaction } from "src/transaction/transaction.entity";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'yape',
  entities: [TransactionStatus, Transaction, TransactionType],
  synchronize: true,
  migrations: ['dist/database/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions)
export default dataSource