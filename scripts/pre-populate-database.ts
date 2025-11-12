#!/usr/bin/env node

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { prePopulateDatabase } from './database-utils';
import { Transaction } from '../src/database/entities/transaction.entity';
import { TransactionType } from '../src/database/entities/transaction-type.entity';
import { TransactionStatus } from '../src/database/entities/transaction-status.entity';

config();

async function createDataSource(): Promise<DataSource> {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'wallet_challenge',
    entities: [Transaction, TransactionType, TransactionStatus],
    synchronize: true,
    logging: true,
  });
}

async function main() {
  const dataSource = await createDataSource();

  try {
    await dataSource.initialize();
    console.log('Database connection established');
    await prePopulateDatabase(dataSource);
  } catch (error) {
    console.error('Error pre-populate database:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

main();
