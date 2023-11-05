import * as dotenv from 'dotenv';
import 'reflect-metadata';
import path = require('path');
import { DataSource } from 'typeorm';

const relative = path.join(path.relative('.', __dirname), '..');
dotenv.config({ path: `${relative}/.env` });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.MAIN_DB_HOST,
  port: parseInt(process.env.MAIN_DB_PORT, 10),
  username: process.env.MAIN_DB_USERNAME,
  password: process.env.MAIN_DB_PASSWORD,
  database: process.env.MAIN_DB_NAME,
  synchronize: process.env.MAIN_DB_SYNC === '1',
  migrationsTableName: 'migrations',
  entities: [`${relative}/src/modules/**/*.entity.ts`],
  migrations: [`${relative}/database/migration/*.ts`],
});
