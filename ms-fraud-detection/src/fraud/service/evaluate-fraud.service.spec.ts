/* eslint-disable @typescript-eslint/unbound-method */
import { EvaluateFraudService } from './evaluate-fraud.service';
import { TransactionUpdateKafkaProducer } from '../adapter/out/messaging/kafka/transaction-update-kafka.producer';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

describe('EvaluateFraudService', () => {
  let service: EvaluateFraudService;
  let producer: jest.Mocked<TransactionUpdateKafkaProducer>;
  let configService: jest.Mocked<Partial<ConfigService>>;
  let logger: jest.Mocked<Logger>;

  beforeEach(() => {
    producer = {} as jest.Mocked<TransactionUpdateKafkaProducer>;
    configService = {
      get: jest.fn().mockReturnValue(1000),
    };
    logger = {} as jest.Mocked<Logger>;
    logger.debug = jest.fn();
    service = new EvaluateFraudService(
      producer,
      configService as ConfigService,
      logger,
    );
  });

  it('given amount less than max allowed when evaluateTransaction then status is APPROVED', async () => {
    const transactionId = 'tx123';
    const amount = 500;
    producer.produceTransactionUpdatedEvent = jest.fn();
    await service.evaluateTransaction(transactionId, amount);
    expect(producer.produceTransactionUpdatedEvent).toHaveBeenCalledWith(
      transactionId,
      expect.stringContaining('APPROVED'),
    );
  });

  it('given amount greater than max allowed when evaluateTransaction then status is REJECTED', async () => {
    const transactionId = 'tx123';
    const amount = 1500;
    producer.produceTransactionUpdatedEvent = jest.fn();
    await service.evaluateTransaction(transactionId, amount);
    expect(producer.produceTransactionUpdatedEvent).toHaveBeenCalledWith(
      transactionId,
      expect.stringContaining('REJECTED'),
    );
  });
});
