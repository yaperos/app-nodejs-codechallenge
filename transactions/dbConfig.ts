import { Transaction } from 'src/modules/transaction/domain/transaction.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'yape',
  entities: [Transaction],
  synchronize: true,
};
