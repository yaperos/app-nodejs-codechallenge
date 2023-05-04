import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSoruceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'challenge',
  schema: 'challenge_schema',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSoruceOptions);

export default dataSource;
