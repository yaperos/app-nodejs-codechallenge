export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3002,
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'fraud-detection',
    brokers: [process.env.KAFKA_BROKER],
    groupId: process.env.KAFKA_GROUP_ID || 'fraud-detection-group',
  },
});
