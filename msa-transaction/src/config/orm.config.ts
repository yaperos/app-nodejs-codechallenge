import { DataSourceOptions } from 'typeorm';

export const OrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || 'postgres',
  database: process.env.TYPEORM_DATABASE || 'transactions',
  connectTimeoutMS: 4000,
  entities: ['dist/modules/**/entities/*.entity.js'],
  synchronize: false,
  migrationsRun: true,
  migrations: ['dist/modules/**/migrations/*.js'],
};
