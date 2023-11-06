import { Transport, KafkaOptions } from '@nestjs/microservices';

const {
  kafka_host: KAFKA_HOST,
  kafka_group_id: KAFKA_GROUP_ID,
  fraud_transaction_validation_topic: FRAUD_TRANSACTION_VALIDATION_TOPIC,
  fraud_status_transaction_topic: FRAUD_STATUS_TRANSACTION_TOPIC,
} = process.env;

export const KAFKA_TOPICS = [
  FRAUD_TRANSACTION_VALIDATION_TOPIC,
  FRAUD_STATUS_TRANSACTION_TOPIC,
];

export const TOPIC_NAMES = {
  FRAUD_TRANSACTION_VALIDATION_TOPIC,
  FRAUD_STATUS_TRANSACTION_TOPIC,
};

export const KAFKA = {
  topics: [FRAUD_TRANSACTION_VALIDATION_TOPIC, FRAUD_STATUS_TRANSACTION_TOPIC],
  broker: KAFKA_HOST,
  groupId: KAFKA_GROUP_ID,
};

export const microServiceKafka: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    consumer: {
      groupId: KAFKA.groupId,
    },
    client: {
      brokers: KAFKA.broker?.split(','),
    },
    subscribe: {
      fromBeginning: false,
    },
  },
};
