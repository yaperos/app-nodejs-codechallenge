import { DataSource } from 'typeorm';

// Note: use your corresponding Database config
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// General DB connection config
const ormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin_local',
  database: 'yape_test',
  logging: true,
  entities: ['dist/infra/db/entities/*.js'],
  migrations: ['dist/infra/db/migrations/*.js'],
  synchronize: true,
};

export default new DataSource(ormConfig);
