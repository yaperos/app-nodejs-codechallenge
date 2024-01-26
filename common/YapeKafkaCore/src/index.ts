import {
  IErrorMessage, ITransactionRequestMessage,
  ITransactionStatusMessage, IVerifyTransactionMessage
} from './interfaces';
import { KafkaConnection } from './core/KafkaConnection';
import { BasePublisher } from './core/BasePublisher';
import { BaseConsumer } from './core/BaseConsumer';
import { ConfigEnv } from './config';

function createPublisher<T = any>(topicConfig: string) {
  const instance = KafkaConnection.getInstance(topicConfig);
  return new BasePublisher<T>(instance);
}

function createConsumerFactory<T = any>(topicConfig: string) {
  const instance = KafkaConnection.getInstance(topicConfig);
  return (groupTag: string) => new BaseConsumer<T>(instance, groupTag);
}

export const VerifyTransactionPublisher = createPublisher<IVerifyTransactionMessage>(ConfigEnv.topics.verifyTransaction);
export const VerifyTransactionConsumerFactory = createConsumerFactory<IVerifyTransactionMessage>(ConfigEnv.topics.verifyTransaction);

export const TransactionRequestPublisher = createPublisher<ITransactionRequestMessage>(ConfigEnv.topics.transactionRequest);
export const TransactionRequestConsumerFactory = createConsumerFactory<ITransactionRequestMessage>(ConfigEnv.topics.transactionRequest);

export const TransactionStatusPublisher = createPublisher<ITransactionStatusMessage>(ConfigEnv.topics.transactionStatus);
export const TransactionStatusConsumerFactory = createConsumerFactory<ITransactionStatusMessage>(ConfigEnv.topics.transactionStatus);

export const TransactionErrorPublisher = createPublisher<IErrorMessage>(ConfigEnv.topics.transactionError);
export const TransactionErrorConsumerFactory = createConsumerFactory<IErrorMessage>(ConfigEnv.topics.transactionError);