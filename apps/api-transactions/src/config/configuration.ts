export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      postgres: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASS,
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        database: process.env.POSTGRES_DB,
      },
    },
    kafka: {
      brokers: [process.env.KAFKA_BROKER],
    },
  };
};
