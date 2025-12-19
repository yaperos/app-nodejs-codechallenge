/* eslint-disable @typescript-eslint/unbound-method */
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Kafka, Producer } from 'kafkajs';
import { Logger } from 'nestjs-pino';
import { TransactionUpdateKafkaProducer } from './transaction-update-kafka.producer';
import { TransactionStatus } from '../../../../../fraud/entity/transaction-status.enum';

describe('TransactionUpdateKafkaProducer', () => {
  let producer: TransactionUpdateKafkaProducer;
  let configService: jest.Mocked<Partial<ConfigService>>;
  let kafka: jest.Mocked<Kafka>;
  let kafkaProducer: jest.Mocked<Producer>;
  let logger: jest.Mocked<Logger>;

  beforeEach(() => {
    kafkaProducer = {} as jest.Mocked<Producer>;

    kafka = {} as jest.Mocked<Kafka>;
    kafka.producer = jest.fn().mockReturnValue(kafkaProducer);
    kafkaProducer.connect = jest.fn();

    configService = {
      get: jest.fn().mockReturnValue('transaction-update-topic'),
    };

    logger = {} as jest.Mocked<Logger>;
    logger.debug = jest.fn();
    logger.error = jest.fn();

    producer = new TransactionUpdateKafkaProducer(
      configService as ConfigService,
      kafka,
      logger,
    );
  });

  describe('onModuleInit', () => {
    it('should connect producer on module init', async () => {
      await producer.onModuleInit();

      expect(kafka.producer).toHaveBeenCalled();
      expect(kafkaProducer.connect).toHaveBeenCalled();
    });
  });

  describe('produceTransactionUpdatedEvent', () => {
    beforeEach(async () => {
      await producer.onModuleInit();
    });

    it('given a transaction ID and status, should publish transaction update event successfully', async () => {
      const transactionId = 'txn-123';
      const status = TransactionStatus.APPROVED;
      const message = JSON.stringify({ transactionId, status });

      kafkaProducer.send = jest.fn();

      await producer.produceTransactionUpdatedEvent(transactionId, status);

      expect(logger.debug).toHaveBeenCalled();
      expect(kafkaProducer.send).toHaveBeenCalledWith({
        topic: 'transaction-update-topic',
        messages: [
          {
            key: transactionId,
            value: message,
          },
        ],
      });
    });

    it('given a transaction ID and status, should handle error when publishing event fails', async () => {
      const transactionId = 'txn-456';
      const status = TransactionStatus.REJECTED;

      kafkaProducer.send = jest
        .fn()
        .mockRejectedValue(new Error('Publish failed'));

      await producer.produceTransactionUpdatedEvent(transactionId, status);

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
