import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: ['src/**/**/*.model.ts'],
  migrations: ['src/database/migrations/*.ts'],
  extra: {
    trustServerCertificate: true,  
  },
  seeds: ['src/database/seeds/*.ts'],
}

export default new DataSource(dataSourceOptions);