import { Client, types } from 'pg';

const databaseConfig: Client = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DATABASE,
};

export default databaseConfig;
