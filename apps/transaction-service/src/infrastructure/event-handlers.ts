import { kafkaConsumer, kafkaProducer, logger } from './di';

export const closeConnections = () => {
  kafkaProducer.disconnect((producerErr) => {
    producerErr
      ? logger.error('Error disconnecting Kafka producer:', producerErr)
      : logger.info('Kafka producer disconnected.');

    kafkaConsumer.disconnect((consumerErr) => {
      consumerErr
        ? logger.error('Error disconnecting Kafka consumer:', consumerErr)
        : logger.info('Kafka consumer disconnected.');

      process.exit();
    });
  });
};
