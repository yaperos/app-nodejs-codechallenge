import { Client, types } from 'pg';

const databaseConfig: Client = {
  user: 'postgres',
  password: 'postgres',
  host: 'postgres',
  port: 5432,
  database: 'yape',
};

export default databaseConfig;
