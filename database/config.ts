import { SeederOptions } from 'typeorm-extension';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  migrations: ['./database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  seeds: ['./database/seeds/*.seeder.ts'],
};

export const dataSource = new DataSource(
  config as DataSourceOptions & SeederOptions,
);
