export const EnvConfig = {
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
  whiteList: process.env.WHITE_LIST?.split(',') || ['*'],
  kafkaHost: process.env.KAFKA_HOST || 'localhost:9092',
  kafkaTopicAntifraud: process.env.KAFKA_TOPIC_ANTI_FRAUD || 'anti-fraud-topic',
  kafkaTopicTransac: process.env.KAFKA_TOPIC_TRANSAC || 'transac-topic',
  kafkaClientId: process.env.KAFKA_CLIENT_ID || 'transactions',
  kafkaGroupId: process.env.KAFKA_GROUP_ID || 'transactions-group',
}
