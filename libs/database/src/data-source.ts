import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/entities/*.js}'],
  migrations: ['dist/**/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
