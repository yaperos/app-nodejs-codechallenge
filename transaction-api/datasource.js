// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DataSource } = require('typeorm');

const dataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{ .ts,.js}'],
  synchronize: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
});

dataSource.initialize();

module.exports = { dataSource };
