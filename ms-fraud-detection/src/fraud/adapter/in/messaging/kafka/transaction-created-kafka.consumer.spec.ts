/* eslint-disable @typescript-eslint/unbound-method */
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, KafkaMessage } from 'kafkajs';
import { EvaluateFraudService } from 'src/fraud/service/evaluate-fraud.service';
import { TransactionCreatedKafkaConsumer } from './transaction-created-kafka.consumer';
import { Logger } from 'nestjs-pino';

describe('TransactionCreatedKafkaConsumer', () => {
  let consumer: TransactionCreatedKafkaConsumer;
  let evaluateFraudService: jest.Mocked<EvaluateFraudService>;
  let configService: jest.Mocked<Partial<ConfigService>>;
  let kafkaClient: jest.Mocked<Kafka>;
  let logger: jest.Mocked<Logger>;
  let mockKafkaConsumer: jest.Mocked<Consumer>;

  beforeEach(() => {
    evaluateFraudService = {} as jest.Mocked<EvaluateFraudService>;
    configService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          KAFKA_CONSUMER_GROUP_ID: 'test-group',
          KAFKA_TOPIC_TRANSACTION_CREATED: 'transaction-created',
        };
        return config[key];
      }),
    };
    mockKafkaConsumer = {} as jest.Mocked<Consumer>;
    kafkaClient = {} as jest.Mocked<Kafka>;
    kafkaClient.consumer = jest.fn().mockReturnValue(mockKafkaConsumer);
    mockKafkaConsumer.connect = jest.fn();
    mockKafkaConsumer.subscribe = jest.fn();
    mockKafkaConsumer.run = jest.fn();

    logger = {} as jest.Mocked<Logger>;
    logger.debug = jest.fn();
    logger.warn = jest.fn();

    consumer = new TransactionCreatedKafkaConsumer(
      evaluateFraudService,
      configService as ConfigService,
      kafkaClient,
      logger,
    );
  });

  describe('onModuleInit', () => {
    it('given valid configuration, should connect to kafka and subscribe to topic', async () => {
      await consumer.onModuleInit();

      expect(kafkaClient.consumer).toHaveBeenCalledWith({
        groupId: 'test-group',
      });
      expect(mockKafkaConsumer.connect).toHaveBeenCalled();
      expect(mockKafkaConsumer.subscribe).toHaveBeenCalledWith({
        topic: 'transaction-created',
        fromBeginning: false,
      });
    });
  });

  describe('handleMessage', () => {
    it('given valid transaction data, should process message and evaluate fraud', async () => {
      const message = {
        value: Buffer.from(
          JSON.stringify({ transactionId: 'txn-789', amount: 250 }),
        ),
      };
      evaluateFraudService.evaluateTransaction = jest.fn();

      await consumer.handleMessage(message as KafkaMessage);

      expect(evaluateFraudService.evaluateTransaction).toHaveBeenCalledWith(
        'txn-789',
        250,
      );
    });

    it('given null message value, should log warning and skip processing', async () => {
      const message = { value: null } as KafkaMessage;

      await consumer.handleMessage(message);
      evaluateFraudService.evaluateTransaction = jest.fn();

      expect(logger.warn).toHaveBeenCalled();
      expect(evaluateFraudService.evaluateTransaction).not.toHaveBeenCalled();
    });
  });
});
