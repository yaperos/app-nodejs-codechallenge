import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { configuration } from './configuration';

export const databaseConnection = new DataSource({
  type: 'postgres',
  host: configuration.database.host,
  port: configuration.database.port,
  username: configuration.database.user,
  password: configuration.database.password,
  database: configuration.database.name,
  synchronize: configuration.database.synchronize,
});
