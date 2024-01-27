import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TransactionModel } from '../model/transaction.model';
import { TransactionTypeModel } from '../model/typeTransaction.model';
import * as dotenv from 'dotenv';
dotenv.config();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  database: process.env.POSTGRES_DATABASE,
  entities: [TransactionModel,TransactionTypeModel]
};

export default typeOrmConfig;
