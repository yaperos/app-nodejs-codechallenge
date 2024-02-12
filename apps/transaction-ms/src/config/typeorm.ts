import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.POSTGRES_HOST || 'localhost'}`,
  port: `${process.env.POSTGRES_PORT || 5432}`,
  username: `${process.env.POSTGRES_USER || 'postgres'}`,
  password: `${process.env.POSTGRES_PASSWORD || 'postgres'}`,
  database: `${process.env.POSTGRES_DATABASE || 'app-nodejs-codechallenge'}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  autoLoadEntities: true,
  synchronize: false,
  cache: {
    type: 'redis',
    options: {
      host: `${process.env.REDIS_HOST}`,
      port: `${process.env.REDIS_PORT}`,
    },
  },
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
