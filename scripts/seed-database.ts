#!/usr/bin/env node

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { seedDatabase } from '../src/database/seed';
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
    database: process.env.DB_DATABASE || 'yape_challenge',
    entities: [Transaction, TransactionType, TransactionStatus],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  });
}

async function main() {
  const dataSource = await createDataSource();

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    await seedDatabase(dataSource);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

main();
