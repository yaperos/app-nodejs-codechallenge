require('dotenv').config();

import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

import { Status } from '../models/status.model';
import { TransactionType } from '../models/transaction_type.model';
import { Transaction } from '../models/transaction.model';

const sequelize = new Sequelize({
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST as string,
  dialect: process.env.DB_DRIVER as Dialect,
  port: Number(process.env.DB_PORT),
  logging: console.log,
  models: [Status, TransactionType, Transaction],
});

export default sequelize;
