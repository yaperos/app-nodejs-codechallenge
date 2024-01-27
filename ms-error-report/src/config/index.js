require("dotenv").config();

module.exports.ConfigEnv = {
  port: process.env.PORT || 3000,
  serviceTag: process.env.SERVICE_TAG ?? "ms-error-report",
  db: {
    uri: process.env.DB_URI ?? "mongodb://localhost:27017",
    name: process.env.DB_NAME ?? "transactions-errors",
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
  },
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: process.env.REDIS_PORT ?? 6379,
    queue: process.env.REDIS_QUEUE ?? "retry_queue",
  },
};
