import { InitialMigration1697482962190 } from './migrations/1697482962190-InitialMigration';
import { DataSource } from 'typeorm';
import { InitialDataMigration1697486543678 } from './migrations/1697486543678-InitialDataMigration';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [],
  migrations: [
    InitialMigration1697482962190,
    InitialDataMigration1697486543678,
  ],
});
