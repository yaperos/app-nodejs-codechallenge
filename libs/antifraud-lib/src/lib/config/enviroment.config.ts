export default () => ({
  KAFKA_BROKER: process.env.BROKER || 'localhost:9092',
  KAFKA_CONSUMER_GROUP_ID_CLI:
    process.env.GROUP_ID_CLIENT || 'kafka-microservices',
  KAFKA_CLIENT_ID: process.env.CLIENT_ID || 'app-gateway',
});
