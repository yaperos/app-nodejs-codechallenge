export default () => ({
  http: {
    port: parseInt(process.env.HTTP_PORT ?? '3000', 10),
  },
  database: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/yape',
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092')
      .split(',')
      .map((broker: string) => broker.trim())
      .filter((broker: string) => broker.length > 0),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'transaction-service',
    groupId: process.env.KAFKA_GROUP_ID ?? 'transaction-service-status-consumer',
  },
  schemaRegistry: {
    url: process.env.SCHEMA_REGISTRY_URL ?? 'http://localhost:8081',
  },
  outbox: {
    pollIntervalMs: parseInt(process.env.OUTBOX_POLL_INTERVAL_MS ?? '2000', 10),
    batchSize: parseInt(process.env.OUTBOX_BATCH_SIZE ?? '50', 10),
    maxAttempts: parseInt(process.env.OUTBOX_MAX_ATTEMPTS ?? '5', 10),
    baseRetryDelayMs: parseInt(process.env.OUTBOX_BASE_RETRY_DELAY_MS ?? '1000', 10),
  },
});
