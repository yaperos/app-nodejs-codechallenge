require("dotenv").config();

const config = {
  "port": process.env.PORT,
  "apiEndpoint": process.env.API_ENDPOINT,
  "db_url": process.env.DB_URL,
  "environment": process.env.ENVIRONMENT,
  "db_host": process.env.DB_HOST,
  "db_port": process.env.DB_PORT,
  "db_user": process.env.DB_USER,
  "db_password": process.env.DB_PASSWORD,
  "db_database": process.env.DB_DATABASE,
  "broker_clientId": process.env.BROKER_CLIENT,
}

module.exports = { config: config };
