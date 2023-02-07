import { DataSource } from 'typeorm';
import * as path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'db_yape',
  synchronize: true,
  migrationsRun: true,
  logging: false,
  useUTC: true,
  entities: [path.join(__dirname, './src/**/*/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, './src/migrations/*{.ts,.js}')],
});
