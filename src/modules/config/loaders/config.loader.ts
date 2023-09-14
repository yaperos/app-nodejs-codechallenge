import { DatabaseConfigType } from '../types/database.type';
import { ServerConfigType } from '../types/server.type';

export const configLoader = (): ConfigLoader => ({
  server: {
    port: parseInt(process.env.PORT, 10),
    applicationName: process.env.APP_NAME,
  },
  database: {
    type: process.env.MAIN_DB_TYPE,
    host: process.env.MAIN_DB_HOST,
    port: parseInt(process.env.MAIN_DB_PORT, 10),
    username: process.env.MAIN_DB_USERNAME,
    password: process.env.MAIN_DB_PASSWORD,
    database: process.env.MAIN_DB_NAME,
    synchronize: process.env.MAIN_DB_SYNC === '1',
    autoLoadEntities: true,
    migrationsTableName: 'migrations',
    migrationsPath: process.env.MIGRATIONS_PATH,
    runMigrations: process.env.MAIN_DB_RUN_MIGRATIONS === '1',
  },
});

type ConfigLoader = {
  server: ServerConfigType;
  database: DatabaseConfigType;
};
