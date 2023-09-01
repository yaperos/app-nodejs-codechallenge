const { Pool } = require("pg");
const Config = require("./constants");

const pool = new Pool({
  user: Config.postgres.POSTGRES_USER,
  host: Config.postgres.POSTGRES_HOST,
  database: Config.postgres.POSTGRES_DATABASE,
  password: Config.postgres.POSTGRES_PASSWORD,
  port: Config.postgres.POSTGRES_PORT,
});

module.exports = pool;
