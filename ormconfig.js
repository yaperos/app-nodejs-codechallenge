const {
  db_postgres_transactionsdb_user: USER,
  db_postgres_transactionsdb_password: PASSWORD,
  db_postgres_transactionsdb_name: DB_NAME,
  db_postgres_transactionsdb_host: HOST,
  db_postgres_transactionsdb_port: PORT,
  DATABASE_URL,
} = process.env;
module.exports = {
  type: 'postgres',
  url: DATABASE_URL,
  host: HOST,
  port: parseInt(PORT),
  username: USER,
  password: PASSWORD,
  database: DB_NAME,
  logger: 'advanced-console',
  cache: true,
  logging: 'all',
  synchronize: false,
  dropSchema: false,
  entities: ['dist/database/models/**/*.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  migrationsTableName: 'migrations',
  cli: {
    entitiesDir: 'src/database/models',
    migrationsDir: 'src/database/migrations',
  },
  ssl: {
    rejectUnauthorized: false,
  },
};
