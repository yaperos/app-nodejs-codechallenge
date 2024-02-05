import { Test, TestingModule } from '@nestjs/testing';
import { KafkaMessage } from 'kafkajs';

import { AppService } from '../../../../app.service';
import { KafkaService } from '../../../../modules/kafka/kafka.service';
import { TransactionKafkaService } from './transaction-kafka.service';

describe('TransactionKafkaService', () => {
  let service: TransactionKafkaService;
  let kafkaService: jest.Mocked<KafkaService>;

  beforeEach(async () => {
    const kafkaServiceMock = {
      subscribeToTopic: jest.fn(),
      sendMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionKafkaService,
        { provide: KafkaService, useValue: kafkaServiceMock },
      ],
    }).compile();

    service = module.get<TransactionKafkaService>(TransactionKafkaService);
    kafkaService = module.get(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a status', async () => {
    const transactionId = '8e6d77ca-ca6e-40f7-88a5-c5a0728c0420';
    const status = 'APPROVED';
    await service.sentStatus(transactionId, status);
    expect(kafkaService.sendMessage).toHaveBeenCalledWith(
      AppService.kafka_topic_status,
      { transactionId, status },
    );
  });

  it('should receive a result and send a status', async () => {
    const message: KafkaMessage = {
      value: Buffer.from(
        JSON.stringify({
          transactionId: '8e6d77ca-ca6e-40f7-88a5-c5a0728c0420',
          value: 100,
        }),
      ),
      key: null,
      timestamp: '2022-01-01T00:00:00Z',
      attributes: 0,
      offset: '0',
      headers: null,
    };
    await service.receiveResult(message);
    expect(kafkaService.sendMessage).toHaveBeenCalledWith(
      AppService.kafka_topic_status,
      {
        transactionId: '8e6d77ca-ca6e-40f7-88a5-c5a0728c0420',
        status: 'APPROVED',
      },
    );
  });

  it('should throw an error if the message cannot be parsed', async () => {
    const message: KafkaMessage = {
      value: Buffer.from('invalid JSON'),
      key: null,
      timestamp: '2022-01-01T00:00:00Z',
      attributes: 0,
      offset: '0',
      headers: null,
    };
    await expect(service.receiveResult(message)).rejects.toThrow();
  });

  it('should return APPROVED if value is less than or equal to max value', () => {
    const valueMax = 100;
    expect(service.getStatus(valueMax)).toEqual('APPROVED');
  });

  it('should return REJECTED if value is greater than max value', () => {
    const valueMax = 1200;
    expect(service.getStatus(valueMax)).toEqual('REJECTED');
  });
});
