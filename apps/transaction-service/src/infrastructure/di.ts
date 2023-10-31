import Kafka from 'node-rdkafka';
import { Surreal } from 'surrealdb.js';
import winston, { format } from 'winston';

import {
  CreateTransactionUseCase,
  UpdateTransactionUseCase,
} from '../core/usecases';
import {
  AppTransactionParserService,
  DatabaseTransactionRepository,
  DatabaseTransactionTypeRepository,
  KafkaEventEmitter,
  SocketRealTimeEventEmitter,
} from './adapters';
import { KAFKA_BROKERS, TRANSACTION_CREATED_EVENT_TOPIC } from './environment';

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
    'group.id': 'transaction-service',
    'metadata.broker.list': KAFKA_BROKERS,
  },
  {},
);

export const surrealDb = new Surreal();

const eventEmitter = new KafkaEventEmitter(kafkaProducer, {
  transactionCreatedTopic: TRANSACTION_CREATED_EVENT_TOPIC,
});
const realTimeEventEmitter = new SocketRealTimeEventEmitter();

const transactionRepository = new DatabaseTransactionRepository(
  surrealDb,
  logger,
);
const transactionTypeRepository = new DatabaseTransactionTypeRepository(
  surrealDb,
  logger,
);

const transactionParserService = new AppTransactionParserService();

const createTransactionUseCase = new CreateTransactionUseCase({
  eventEmitter,
  parserService: transactionParserService,
  transactionRepository,
  transactionTypeRepository,
});
const updateTransactionUseCase = new UpdateTransactionUseCase({
  parserService: transactionParserService,
  realTimeEventEmitter,
  transactionRepository,
});

export { createTransactionUseCase, updateTransactionUseCase };
