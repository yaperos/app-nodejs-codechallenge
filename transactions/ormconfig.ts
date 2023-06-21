import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const AppDataSourceMigrations = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: ['src/commons/database/migrations/*.ts'],
  entities: ['src/**/**.entity{.ts,.js}'],
  cli: {
    migrationsDir: 'src/commons/database/migrations/*.ts',
    entitiesDir: 'src/**/**.entity{.ts,.js}',
  },
} as any);

export default AppDataSourceMigrations;
