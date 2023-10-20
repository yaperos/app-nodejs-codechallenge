const DEFAULT_CLIENT_ID = 'yape_client';
const DEFAULT_CONSUMER_GROUP_ID = 'yape_fraud_validator';
const REQUEST_FRAUD_TOPIC_ENV = process.env.REQUEST_FRAUD_TOPIC || 'request_topic';
const RESPONSE_FRAUD_TOPIC_ENV = process.env.RESPONSE_FRAUD_TOPIC || 'response_topic';
const FRAUD_BROKER_ENV = process.env.FRAUD_BROKER || 'KAFKA_BROKER';

const Fraud = {
    REQUEST_TOPIC_ENV: REQUEST_FRAUD_TOPIC_ENV,
    REQUEST_TOPIC: process.env[REQUEST_FRAUD_TOPIC_ENV],
    RESPONSE_TOPIC_ENV: RESPONSE_FRAUD_TOPIC_ENV,
    RESPONSE_TOPIC:process.env[RESPONSE_FRAUD_TOPIC_ENV],
    BROKER_ENV:FRAUD_BROKER_ENV,
    BROKER:process.env[FRAUD_BROKER_ENV]?.split(',') || []
};

const BROKERS = [];
BROKERS.push(...Fraud.BROKER)

const General = {
    CLIENT_ID: process.env.CLIENT_ID || DEFAULT_CLIENT_ID,
    CONSUMER_GROUP_ID: process.env.CONSUMER_GROUP_ID || DEFAULT_CONSUMER_GROUP_ID,
    BROKERS,
    LOGS_ENABLED: process.env.KAFKA_LOGS_ENABLED === 'true'
};

export const KafkaConstants = {
    Fraud,
    General
};