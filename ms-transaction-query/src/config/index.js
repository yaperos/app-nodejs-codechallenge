require('dotenv').config();

module.exports.ConfigEnv = {
  port: process.env.PORT || 3030,
  API_PREFIX: '/api/v1',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'transaction_status',
  },
};
