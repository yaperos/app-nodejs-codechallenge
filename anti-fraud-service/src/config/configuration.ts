export default () => ({
  kafka: {
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092')
      .split(',')
      .map((broker: string) => broker.trim())
      .filter((broker: string) => broker.length > 0),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'anti-fraud-service',
    groupId: process.env.KAFKA_GROUP_ID ?? 'anti-fraud-service-consumer',
  },
  schemaRegistry: {
    url: process.env.SCHEMA_REGISTRY_URL ?? 'http://localhost:8081',
  },
});
