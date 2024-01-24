import { KafkaConnection } from './core/KafkaConnection';
import { BasePublisher } from './core/BasePublisher';
import { BaseConsumer } from './core/BaseConsumer';
import { ConfigEnv } from './config';

function createPublisher(topicConfig: string) {
  const instance = KafkaConnection.getInstance(topicConfig);
  return new BasePublisher(instance);
}

function createConsumerFactory(topicConfig: string) {
  const instance = KafkaConnection.getInstance(topicConfig);
  return (groupTag: string) => new BaseConsumer(instance, groupTag);
}

export const TransactionPublisher = createPublisher(ConfigEnv.topics.transaction);
export const TransactionConsumerFactory = createConsumerFactory(ConfigEnv.topics.transaction);

export const TransactionRequestPublisher = createPublisher(ConfigEnv.topics.transactionRequest);
export const TransactionRequestConsumerFactory = createConsumerFactory(ConfigEnv.topics.transactionRequest);

export const TransactionStatusPublisher = createPublisher(ConfigEnv.topics.transactionStatus);
export const TransactionStatusConsumerFactory = createConsumerFactory(ConfigEnv.topics.transactionStatus);
