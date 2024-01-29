import { Sequelize } from 'sequelize-typescript';
import { MigrationError, SequelizeStorage, Umzug } from 'umzug';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Sequelize(
  process.env.DB_HOST || 'DATABASE_NAME',
  process.env.DATABASE_USER || 'postgres',
  process.env.DATABASE_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    models: [__dirname + '/entities'],
    logging: false
  }
);

export const migrator = new Umzug({
  migrations: {
    glob: ['migrations/*.ts', { cwd: __dirname }]
  },
  context: db,
  storage: new SequelizeStorage({
    sequelize: db,
    modelName: 'migration_meta'
  }),
  logger: undefined
});

export const seeder = new Umzug({
  migrations: {
    glob: ['seeders/*.ts', { cwd: __dirname }]
  },
  context: db,
  storage: new SequelizeStorage({
    sequelize: db,
    modelName: 'seeder_meta'
  }),
  logger: undefined
});

export type Migration = typeof migrator._types.migration;

export type Seeder = typeof seeder._types.migration;

export async function Sync() {
  try {
    await migrator.up();
    await seeder.up();
  } catch (e) {
    if (e instanceof MigrationError) {
      const original = e.cause;
      console.log(original);
    }
    throw e;
  }
}
