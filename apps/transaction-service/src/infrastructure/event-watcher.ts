import { TransactionStatus } from '../core/domain';
import { kafkaConsumer, logger, updateTransactionUseCase } from './di';
import {
  TRANSACTION_APPROVED_EVENT_TOPIC,
  TRANSACTION_REJECTED_EVENT_TOPIC,
} from './environment';

const TransactionStatusByTopic = {
  [TRANSACTION_APPROVED_EVENT_TOPIC]: TransactionStatus.APPROVED,
  [TRANSACTION_REJECTED_EVENT_TOPIC]: TransactionStatus.REJECTED,
};

export const initEventWatcher = () => {
  const topics = [
    TRANSACTION_APPROVED_EVENT_TOPIC,
    TRANSACTION_REJECTED_EVENT_TOPIC,
  ];
  kafkaConsumer.connect();

  kafkaConsumer
    .on('ready', () => {
      kafkaConsumer.subscribe(topics);

      kafkaConsumer.consume();
    })
    .on('subscribed', () => {
      logger.info('KAFKA_CONSUMER_READY', { topics });
    })
    .on('data', (data) => {
      const dataValue = data.value?.toString();

      if (!dataValue) {
        logger.error('EVENT_ERROR', {
          message: 'Error reading event value',
          ...data,
        });
        return;
      }

      try {
        const parsedData = JSON.parse(dataValue);

        const transactionStatus = TransactionStatusByTopic[data.topic];

        updateTransactionUseCase.execute({
          status: transactionStatus,
          ...parsedData,
        });
      } catch (error) {
        logger.error('EVENT_PROCESSING_ERROR', error);
      }
    });
};
