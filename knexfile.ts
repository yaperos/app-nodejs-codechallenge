import { knexSnakeCaseMappers } from "objection";
import dotenv from "dotenv";

dotenv.config();

export default {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + "/db/migrations",
      tableName: "knex_migrations"
    },
    ...knexSnakeCaseMappers(),
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_CONNECTION_POOL_URL + `ssl=np-verify`,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + "/db/migrations",
      tableName: "knex_migrations"
    },
    ...knexSnakeCaseMappers(),
  }

};
