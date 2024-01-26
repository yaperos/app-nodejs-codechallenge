import { KafkaConnection } from './core/KafkaConnection';
import { BasePublisher } from './core/BasePublisher';
import { BaseConsumer } from './core/BaseConsumer';
import { IErrorMessage } from './interfaces';
import { ConfigEnv } from './config';

function createPublisher<T = any>(topicConfig: string) {
  const instance = KafkaConnection.getInstance(topicConfig);
  return new BasePublisher<T>(instance);
}

function createConsumerFactory<T = any>(topicConfig: string) {
  const instance = KafkaConnection.getInstance(topicConfig);
  return (groupTag: string) => new BaseConsumer<T>(instance, groupTag);
}

export const TransactionPublisher = createPublisher(ConfigEnv.topics.transaction);
export const TransactionConsumerFactory = createConsumerFactory(ConfigEnv.topics.transaction);

export const TransactionRequestPublisher = createPublisher(ConfigEnv.topics.transactionRequest);
export const TransactionRequestConsumerFactory = createConsumerFactory(ConfigEnv.topics.transactionRequest);

export const TransactionStatusPublisher = createPublisher(ConfigEnv.topics.transactionStatus);
export const TransactionStatusConsumerFactory = createConsumerFactory(ConfigEnv.topics.transactionStatus);

export const TransactionErrorPublisher = createPublisher<IErrorMessage>(ConfigEnv.topics.transactionError);
export const TransactionErrorConsumerFactory = createConsumerFactory<IErrorMessage>(ConfigEnv.topics.transactionError);