import config from '@app/config';

const DB_TYPE:
  | 'mysql'
  | 'mariadb'
  | 'postgres'
  | 'mssql'
  | 'oracle'
  | 'sqlite' = 'postgres';

export const DB_CONFIG = {
  type: DB_TYPE,
  host: config.DB.HOST,
  port: config.DB.PORT,
  username: config.DB.USERNAME,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
};
