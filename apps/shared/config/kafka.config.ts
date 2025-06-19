export const kafkaConfig = {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: process.env.KAFKA_CLIENT_ID || 'yape-app',
    groupId: process.env.KAFKA_GROUP_ID || 'transaction-consumer',
    topics: {
        TRANSACTION_CREATED: 'transaction_created',
    },
    retries: {
        max: 3,
        initialRetryTime: 100,
        retryDelayFactor: 2,
    },
} as const;
