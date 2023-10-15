export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_NAME || "postgres",
    sync: Boolean(process.env.ORM_SYNC) || true,
  },
  kafka: {
    broker: process.env.KAFKA_BROKER || "localhost:9092",
  },
  graphql: {
    playground: Boolean(process.env.GRAPHQL_PLAYGROUND) || false,
  },
});
