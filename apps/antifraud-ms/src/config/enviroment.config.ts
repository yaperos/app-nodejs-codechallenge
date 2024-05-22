export default () => ({
  KAFKA_BROKER: process.env.BROKER || 'localhost:9092',
  KAFKA_GROUP_ID: process.env.GROUP_ID || 'consumer',
});
