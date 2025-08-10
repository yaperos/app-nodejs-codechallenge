export const envConfig = {
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID ?? 'yape',
    groupId: process.env.KAFKA_GROUP_ID ?? 'yape-cg',
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
    txClientId: process.env.TX_API_CLIENT_ID ?? 'transactions-api',
    antiFraudClientId: process.env.ANTI_FRAUD_CLIENT_ID ?? 'fraud-api',
    txConsumerGroupId: process.env.TX_API_GROUP_ID ?? 'transactions-api-cg',
    antiFraudConsumerGroupId: process.env.ANTI_FRAUD_GROUP_ID ?? 'fraud-api-cg',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    db: Number(process.env.REDIS_DB ?? 0),
    password: process.env.REDIS_PASSWORD,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  app: {
    port: Number(process.env.PORT ?? 3000),
  },
} as const;