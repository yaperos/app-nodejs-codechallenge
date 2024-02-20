import { DataSource } from 'typeorm';
import { configuration } from '../config';

export const databaseConnection = new DataSource({
  type: 'postgres',
  host: configuration.database.host,
  port: configuration.database.port,
  username: configuration.database.user,
  password: configuration.database.password,
  database: configuration.database.name,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configuration.database.synchronize,
});
