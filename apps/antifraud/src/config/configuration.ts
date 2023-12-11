export default () => ({
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'antifraud',
    groupId: process.env.KAFKA_GROUP_ID || 'antifraud-consumer',
    brokers: process.env.KAFKA_BROKERS?.split(','),
  },
});
