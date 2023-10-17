export default () => ({
  http: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || '0.0.0.0',
  },
  db: {
    uri: process.env.DB_HOST || 'mongodb://localhost:27018',
    dbName: process.env.DB_DATABASE || 'transaction',
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'transaction',
    groupId: process.env.KAFKA_GROUP_ID || 'transaction-consumer',
    brokers: process.env.KAFKA_BROKERS?.split(','),
  },
});
