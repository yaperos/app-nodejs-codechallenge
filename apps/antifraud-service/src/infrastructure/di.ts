import Kafka from 'node-rdkafka';
import winston, { format } from 'winston';

import { ValidateTransactionUseCase } from '../core/usecases';
import { KafkaEventEmitter } from './adapters';
import {
  KAFKA_BROKERS,
  TRANSACTION_APPROVED_EVENT_TOPIC,
  TRANSACTION_REJECTED_EVENT_TOPIC,
} from './environment';

export const logger = winston.createLogger({
  defaultMeta: { service: 'transaction-service' },
  format: format.combine(
    format.label({ label: 'transaction-service' }),
    format.timestamp(),
    winston.format.prettyPrint(),
    format.json(),
  ),
  level: 'info',
  transports: [new winston.transports.Console()],
});

export const kafkaProducer = new Kafka.Producer({
  'metadata.broker.list': KAFKA_BROKERS,
});

export const kafkaConsumer = new Kafka.KafkaConsumer(
  {
    'group.id': 'antifraud-service',
    'metadata.broker.list': KAFKA_BROKERS,
  },
  {
    'auto.offset.reset': 'earliest',
  },
);

const eventEmitter = new KafkaEventEmitter(kafkaProducer, {
  approvedTransactionTopic: TRANSACTION_APPROVED_EVENT_TOPIC,
  rejectedTransactionTopic: TRANSACTION_REJECTED_EVENT_TOPIC,
});

const validateTransactionUseCase = new ValidateTransactionUseCase({
  eventEmitter,
  transactionValueLimit: 1000,
});

export { validateTransactionUseCase };
