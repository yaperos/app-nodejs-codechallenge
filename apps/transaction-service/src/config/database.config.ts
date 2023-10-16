import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: 'dev.env' });

const config = {
  type: 'postgres',
  host: `${process.env.TYPEORM_HOST}`,
  port: Number(process.env.TYPEORM_PORT),
  username: `${process.env.TYPEORM_TRANSACTIONS_USERNAME}`,
  password: `${process.env.TYPEORM_TRANSACTIONS_PASSWORD}`,
  database: `${process.env.TYPEORM_TRANSACTIONS_DATABASE}`,
  entities: ['dist/apps/transaction-service/src/database/**/*.entity.ts'],
  migrations: ['dist/apps/transaction-service/src/database/migrations/*.ts'],
  autoLoadEntities: true,
  synchronize: true,
};

export default registerAs('TransactionTypeOrm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
