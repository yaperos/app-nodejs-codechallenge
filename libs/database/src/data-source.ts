import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();
console.log(__dirname);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    process.env.TYPEORM_CLI === 'true'
      ? 'libs/database/src/entities/*.ts'
      : 'dist/**/entities/*.js',
  ],
  migrations: [
    process.env.TYPEORM_CLI === 'true'
      ? 'libs/database/src/migrations/*.ts'
      : 'dist/**/migrations/*.js',
  ],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
