import { kafkaConsumer, logger, validateTransactionUseCase } from './di';
import { TRANSACTION_CREATED_EVENT_TOPIC } from './environment';

export const initEventWatcher = () => {
  const topics = [TRANSACTION_CREATED_EVENT_TOPIC];
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
        validateTransactionUseCase.execute({
          transaction: JSON.parse(dataValue),
        });
      } catch (error) {
        logger.error('EVENT_PROCESSING_ERROR', error);
      }
    });
};
