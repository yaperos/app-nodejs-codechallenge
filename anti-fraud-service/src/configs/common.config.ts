export default () => ({
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'transaction-api-command',
    broker: process.env.KAFKA_BROKER || 'localhost:9092',
  },
});
