export default () => ({
    port: parseInt(process.env.BACKEND_PORT, 8080) || 8080,
    database: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    kafka: {
      host: process.env.KAFKA_HOST,
      port: parseInt(process.env.KAFKA_PORT),
      clientId: process.env.KAFKA_CLIENT_ID,
      groupId: process.env.KAFKA_GROUP_ID
    }
  });
  